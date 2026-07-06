import { PDFDocument, PDFString, StandardFonts, rgb, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { AGE_BANDS, type AgeProofBundle } from "./proveAge.js";

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function addLink(
  pdf: PDFDocument,
  page: PDFPage,
  url: string,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const annotation = pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    }),
  );
  page.node.addAnnot(annotation);
}

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
  const accent = rgb(0.18, 0.35, 0.53);
  const pale = rgb(0.95, 0.97, 0.98);
  const border = rgb(0.82, 0.82, 0.84);

  const margin = 56;
  const contentWidth = 595 - 2 * margin;
  const qrSize = 140;
  const fingerprint = await sha256Hex(verifyUrl);
  let y = 842 - margin;

  page.drawText("range-proof demo", {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: ink,
  });

  page.drawRectangle({
    x: 595 - margin - 86,
    y: y - 5,
    width: 86,
    height: 22,
    color: pale,
    borderColor: border,
    borderWidth: 1,
  });
  page.drawText(AGE_BANDS[bundle.category].chip, {
    x: 595 - margin - 74,
    y: y + 2,
    size: 10,
    font: fontBold,
    color: accent,
  });

  y -= 56;
  page.drawText("Demo range-proof certificate", {
    x: margin,
    y,
    size: 27,
    font: fontBold,
    color: ink,
  });

  y -= 28;
  page.drawText("Cryptographic proof of an age band. Not an identity document.", {
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

  y -= 38;
  page.drawRectangle({
    x: margin,
    y: y - 76,
    width: contentWidth,
    height: 88,
    color: pale,
    borderColor: border,
    borderWidth: 1,
  });
  page.drawText("What this PDF represents", {
    x: margin + 16,
    y,
    size: 12,
    font: fontBold,
    color: ink,
  });
  page.drawText(
    "A locally generated demo certificate for a private age-band proof. It records a cryptographic claim and how to verify it. It does not confirm who typed the birthday or whether an issuer checked it.",
    {
      x: margin + 16,
      y: y - 22,
      size: 10,
      font,
      color: muted,
      maxWidth: contentWidth - 32,
      lineHeight: 14,
    },
  );

  y -= 126;
  page.drawText("Issued", { x: margin, y, size: 10, font, color: muted });
  page.drawText(new Date(bundle.issuedAt).toLocaleString("en-GB"), {
    x: margin,
    y: y - 14,
    size: 13,
    font: fontBold,
    color: ink,
  });

  const rightColumn = margin + 260;
  page.drawText("Claim", { x: rightColumn, y, size: 10, font, color: muted });
  page.drawText(AGE_BANDS[bundle.category].chip, {
    x: rightColumn,
    y: y - 14,
    size: 13,
    font: fontBold,
    color: ink,
  });

  y -= 48;
  page.drawText("Verification", { x: margin, y, size: 10, font, color: muted });
  page.drawText("Open verifier link", {
    x: margin,
    y: y - 14,
    size: 13,
    font: fontBold,
    color: accent,
  });
  addLink(pdf, page, verifyUrl, margin, y - 17, 112, 18);
  page.drawText(
    "If your PDF viewer blocks long links, use Copy verify URL from the web page.",
    {
      x: margin,
      y: y - 34,
      size: 9,
      font,
      color: muted,
      maxWidth: 230,
      lineHeight: 12,
    },
  );

  page.drawText("Payload SHA-256", { x: rightColumn, y, size: 10, font, color: muted });
  page.drawText(`${fingerprint.slice(0, 32)}\n${fingerprint.slice(32)}`, {
    x: rightColumn,
    y: y - 14,
    size: 8.5,
    font: mono,
    color: ink,
    lineHeight: 11,
  });

  y -= 104;
  page.drawText("Proof boundary", { x: margin, y, size: 12, font: fontBold, color: ink });
  page.drawText(
    `This PDF records that the embedded proof ${AGE_BANDS[bundle.category].statement}. The underlying date of birth and blinding factor are not disclosed. The demo uses self-entered data; production use needs a signed credential or other trusted source.`,
    {
      x: margin,
      y: y - 22,
      size: 10,
      font,
      color: muted,
      maxWidth: contentWidth,
      lineHeight: 14,
    },
  );

  y -= 100;
  page.drawText("Prior art", { x: margin, y, size: 12, font: fontBold, color: ink });
  page.drawText(
    "Built on Pedersen commitments, Schnorr-style proofs, CDS OR-composition and Fiat-Shamir. It sits in the same family of ideas as Confidential Transactions, Bulletproofs, Monero and Elements. The contribution here is practical packaging: a small browser TypeScript primitive for ForgeSworn-style credentials.",
    {
      x: margin,
      y: y - 22,
      size: 10,
      font,
      color: muted,
      maxWidth: contentWidth - qrSize - 24,
      lineHeight: 14,
    },
  );

  y -= 110;
  page.drawText("Source", { x: margin, y, size: 10, font, color: muted });
  page.drawText("github.com/forgesworn/range-proof", {
    x: margin,
    y: y - 14,
    size: 10,
    font: mono,
    color: accent,
  });

  // The full verify URL embeds the proof and can be several KB. If it is too
  // large for a QR code, keep the clickable PDF link above and use the QR for
  // the demo origin.
  let qrCaption = "Scan to verify";
  let qrPngDataUrl: string;
  try {
    qrPngDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 0 });
  } catch {
    let origin = "https://range-proof.forgesworn.dev";
    try {
      origin = new URL(verifyUrl).origin;
    } catch {
      // keep the default origin
    }
    qrCaption = "QR opens demo site";
    qrPngDataUrl = await QRCode.toDataURL(origin, { width: 200, margin: 0 });
  }
  const qrBytes = Uint8Array.from(
    atob(qrPngDataUrl.split(",")[1] ?? ""),
    (char) => char.charCodeAt(0),
  );
  const qrImage = await pdf.embedPng(qrBytes);
  page.drawImage(qrImage, {
    x: 595 - margin - qrSize,
    y: margin,
    width: qrSize,
    height: qrSize,
  });

  page.drawText(qrCaption, {
    x: 595 - margin - qrSize,
    y: margin - 14,
    size: 9,
    font,
    color: muted,
  });

  return await pdf.save();
}

export function downloadCertificate(pdf: Uint8Array, filename = "age-certificate.pdf"): void {
  const bytes = new Uint8Array(pdf.byteLength);
  bytes.set(pdf);
  const blob = new Blob([bytes.buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
