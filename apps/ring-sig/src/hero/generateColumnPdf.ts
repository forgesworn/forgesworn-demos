import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import type { SignedColumn } from "./signColumn.js";

const A4 = { width: 595, height: 842 };

export async function generateColumnPdf(
  column: SignedColumn,
  verifyUrl: string,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4.width, A4.height]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  const ink = rgb(0.05, 0.05, 0.05);
  const muted = rgb(0.4, 0.4, 0.4);

  const margin = 56;

  page.drawText("THE INSIDER", {
    x: margin,
    y: A4.height - margin,
    size: 28,
    font: serifBold,
    color: ink,
  });
  page.drawText("A ring-signed column", {
    x: margin,
    y: A4.height - margin - 20,
    size: 10,
    font: serif,
    color: muted,
  });

  page.drawLine({
    start: { x: margin, y: A4.height - margin - 34 },
    end: { x: A4.width - margin, y: A4.height - margin - 34 },
    thickness: 1,
    color: ink,
  });

  page.drawText(new Date(column.issuedAt).toLocaleString("en-GB"), {
    x: margin,
    y: A4.height - margin - 52,
    size: 10,
    font: serif,
    color: muted,
  });

  const bodyLines = wrapText(column.message, 75);
  let y = A4.height - margin - 84;
  for (const line of bodyLines) {
    page.drawText(line, {
      x: margin,
      y,
      size: 12,
      font: serif,
      color: ink,
    });
    y -= 18;
    if (y < margin + 200) break;
  }

  const footerTop = margin + 180;
  page.drawLine({
    start: { x: margin, y: footerTop },
    end: { x: A4.width - margin, y: footerTop },
    thickness: 0.5,
    color: muted,
  });

  page.drawText("Proof of authorship", {
    x: margin,
    y: footerTop - 18,
    size: 10,
    font: serifBold,
    color: ink,
  });

  page.drawText(`Signed by one of ${column.ring.length} ring members.`, {
    x: margin,
    y: footerTop - 34,
    size: 9,
    font: serif,
    color: muted,
  });

  page.drawText(`Key image  ${column.keyImage.slice(0, 32)}…`, {
    x: margin,
    y: footerTop - 50,
    size: 8,
    font: mono,
    color: muted,
  });

  const qrPngDataUrl = await QRCode.toDataURL(verifyUrl, { width: 240, margin: 0 });
  const qrBytes = Uint8Array.from(
    atob(qrPngDataUrl.split(",")[1] ?? ""),
    (c) => c.charCodeAt(0),
  );
  const qrImage = await pdf.embedPng(qrBytes);
  const qrSize = 120;
  page.drawImage(qrImage, {
    x: A4.width - margin - qrSize,
    y: margin,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("Scan to verify", {
    x: A4.width - margin - qrSize,
    y: margin - 14,
    size: 8,
    font: serif,
    color: muted,
  });

  return await pdf.save();
}

function wrapText(text: string, maxChars: number): string[] {
  const paragraphs = text.split("\n");
  const out: string[] = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let line = "";
    for (const word of words) {
      if (line.length + word.length + 1 > maxChars) {
        out.push(line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    if (line) out.push(line);
    out.push("");
  }
  return out;
}

export function downloadColumnPdf(pdf: Uint8Array, filename = "column.pdf"): void {
  const blob = new Blob([pdf as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
