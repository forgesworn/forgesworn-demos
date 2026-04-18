import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const A4 = { width: 595, height: 842 };

export async function generateCardSheet(
  shares: readonly string[][],
  threshold: number,
  total: number,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4.width, A4.height]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);

  const ink = rgb(0.1, 0.1, 0.1);
  const muted = rgb(0.5, 0.5, 0.5);

  const margin = 40;
  page.drawText("shamir-words", { x: margin, y: A4.height - margin, size: 12, font: fontBold, color: ink });
  page.drawText(`${threshold} of ${total} shares — cut along the dotted lines`, {
    x: margin,
    y: A4.height - margin - 14,
    size: 10,
    font,
    color: muted,
  });

  const cols = 2;
  const cardWidth = (A4.width - 2 * margin - 20) / cols;
  const cardHeight = 240;

  for (let index = 0; index < shares.length; index++) {
    const share = shares[index]!;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = margin + col * (cardWidth + 20);
    const y = A4.height - margin - 48 - row * (cardHeight + 20) - cardHeight;

    page.drawRectangle({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      borderColor: ink,
      borderWidth: 1,
      borderDashArray: [4, 4],
    });

    page.drawText(`Share ${index + 1} of ${total}`, {
      x: x + 14,
      y: y + cardHeight - 24,
      size: 11,
      font: fontBold,
      color: ink,
    });
    page.drawText(`Threshold: ${threshold}`, {
      x: x + 14,
      y: y + cardHeight - 40,
      size: 9,
      font,
      color: muted,
    });

    const perColumn = Math.ceil(share.length / 2);
    const wordY = y + cardHeight - 64;
    for (let i = 0; i < share.length; i++) {
      const wordCol = Math.floor(i / perColumn);
      const rowInCol = i % perColumn;
      const wordX = x + 14 + wordCol * (cardWidth / 2 - 10);
      page.drawText(`${(i + 1).toString().padStart(2, "0")}  ${share[i]}`, {
        x: wordX,
        y: wordY - rowInCol * 14,
        size: 9,
        font: mono,
        color: ink,
      });
    }
  }

  page.drawText(
    `Distribute each share to a separate custodian. Any ${threshold} shares can reconstruct the seed; fewer reveal nothing.`,
    {
      x: margin,
      y: margin,
      size: 9,
      font,
      color: muted,
      maxWidth: A4.width - 2 * margin,
    },
  );

  return await pdf.save();
}

export function downloadCardSheet(pdf: Uint8Array, filename = "shamir-cards.pdf"): void {
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
