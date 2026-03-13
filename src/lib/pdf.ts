import jsPDF from "jspdf";

export interface CertificateData {
  projectName: string;
  hash: string;
  walletAddress: string;
  txHash: string;
  timestamp: string;
  registrationId: string;
}

/**
 * Generate a certificate PDF for code registration
 */
export function generateCertificatePdf(data: CertificateData): Blob {
  const { projectName, hash, walletAddress, txHash, timestamp, registrationId } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Background
  doc.setFillColor(20, 20, 40);
  doc.rect(0, 0, 210, 297, "F");

  // Outer border
  doc.setDrawColor(100, 150, 255);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, 186, 273);
  doc.setLineWidth(0.3);
  doc.rect(14, 14, 182, 269);

  // Header
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CODEPROOF", 105, 30, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text("Certificate of Code Authorship", 105, 45, { align: "center" });

  // Decorative line
  doc.setDrawColor(100, 150, 255);
  doc.setLineWidth(0.5);
  doc.line(40, 52, 170, 52);

  // Registration ID
  doc.setTextColor(150, 150, 170);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Certificate ID: ${registrationId}`, 105, 60, { align: "center" });

  // Content section
  let yPos = 78;
  const labelX = 25;
  const valueX = 25;
  const sectionGap = 22;

  // Project Name
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECT NAME", labelX, yPos);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(projectName, valueX, yPos + 7);

  // Code Hash
  yPos += sectionGap;
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CODE HASH (SHA-256)", labelX, yPos);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont("courier", "normal");
  const hashLines = doc.splitTextToSize(hash, 160);
  doc.text(hashLines, valueX, yPos + 7);

  // Author Address
  yPos += sectionGap + (hashLines.length > 1 ? 5 : 0);
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("AUTHOR (POLYGON ADDRESS)", labelX, yPos);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont("courier", "normal");
  doc.text(walletAddress, valueX, yPos + 7);

  // Transaction Hash
  yPos += sectionGap;
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("TRANSACTION HASH", labelX, yPos);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.setFont("courier", "normal");
  if (txHash) {
    const txLines = doc.splitTextToSize(txHash, 160);
    doc.text(txLines, valueX, yPos + 7);
  } else {
    doc.text("N/A", valueX, yPos + 7);
  }

  // Polygonscan link
  if (txHash) {
    yPos += 14;
    doc.setTextColor(100, 150, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const polygonscanUrl = `https://amoy.polygonscan.com/tx/${txHash}`;
    doc.textWithLink(`View on Polygonscan: ${polygonscanUrl}`, valueX, yPos, { url: polygonscanUrl });
  }

  // Registration Date
  yPos += sectionGap;
  doc.setTextColor(100, 150, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("REGISTRATION DATE & TIME", labelX, yPos);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(timestamp, valueX, yPos + 7);

  // Statement
  yPos += sectionGap + 10;
  doc.setDrawColor(100, 150, 255);
  doc.setLineWidth(0.3);
  doc.line(25, yPos - 3, 185, yPos - 3);

  doc.setTextColor(220, 220, 230);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const statement =
    "This certificate proves that the above code hash was registered on the Polygon Amoy blockchain at the above timestamp, providing immutable proof of authorship.";
  const stmtLines = doc.splitTextToSize(statement, 160);
  doc.text(stmtLines, 105, yPos + 5, { align: "center" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.setFont("helvetica", "normal");
  doc.text("CodeProof — Blockchain Code Authentication", 105, 278, {
    align: "center",
  });
  const verifyUrl = `codeproof.io/verify/${hash}`;
  doc.text(`Verify at: ${verifyUrl}`, 105, 283, { align: "center" });

  return doc.output("blob");
}

/**
 * Download certificate PDF to user's computer
 */
export function downloadCertificate(pdf: Blob, projectName: string): void {
  const url = URL.createObjectURL(pdf);
  const link = document.createElement("a");
  link.href = url;
  link.download = `CodeProof_${projectName}_Certificate.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
