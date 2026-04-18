import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import type { AgeProofBundle } from "./proveAge.js";

export async function generateCertificate(
  bundle: AgeProofBundle,
  verifyUrl: string,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  const ink = rgb(0.1, 0.1, 0.1);
  const muted = rgb(0.5, 0.5, 0.5);

  const margin = 56;
  let y = 842 - margin;

  page.drawText("range-proof", {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: ink,
  });

  y -= 56;
  page.drawText("Age-Over-18 Certificate", {
    x: margin,
    y,
    size: 28,
    font: fontBold,
    color: ink,
  });

  y -= 28;
  page.drawText("Verifiable zero-knowledge proof of age without disclosure", {
    x: margin,
    y,
    size: 11,
    font,
    color: muted,
  });

  y -= 48;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 595 - margin, y },
    thickness: 1,
    color: ink,
  });

  y -= 32;
  page.drawText("Issued", { x: margin, y, size: 10, font, color: muted });
  page.drawText(new Date(bundle.issuedAt).toLocaleString("en-GB"), {
    x: margin,
    y: y - 14,
    size: 13,
    font: fontBold,
    color: ink,
  });

  y -= 48;
  page.drawText("Category", { x: margin, y, size: 10, font, color: muted });
  page.drawText("18+", {
    x: margin,
    y: y - 14,
    size: 13,
    font: fontBold,
    color: ink,
  });

  y -= 48;
  page.drawText("Verifier URL", { x: margin, y, size: 10, font, color: muted });
  page.drawText(verifyUrl, {
    x: margin,
    y: y - 14,
    size: 8,
    font: mono,
    color: ink,
  });

  // QR code at bottom right
  const qrPngDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 0 });
  const qrBytes = Uint8Array.from(
    atob(qrPngDataUrl.split(",")[1] ?? ""),
    (char) => char.charCodeAt(0),
  );
  const qrImage = await pdf.embedPng(qrBytes);
  const qrSize = 140;
  page.drawImage(qrImage, {
    x: 595 - margin - qrSize,
    y: margin,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("Scan to verify", {
    x: 595 - margin - qrSize,
    y: margin - 14,
    size: 9,
    font,
    color: muted,
  });

  page.drawText(
    "This certificate proves the holder is age 18 or over. The underlying date of birth is not disclosed.",
    {
      x: margin,
      y: margin + 40,
      size: 9,
      font,
      color: muted,
      maxWidth: 595 - 2 * margin - qrSize - 20,
      lineHeight: 12,
    },
  );

  return await pdf.save();
}

export function downloadCertificate(pdf: Uint8Array, filename = "age-certificate.pdf"): void {
  const blob = new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
