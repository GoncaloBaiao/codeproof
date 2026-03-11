import jsPDF from "jspdf";

/**
 * Generate a certificate PDF for code registration
 *
 * @param projectName Name of the project
 * @param authorAddress Ethereum address of the author (formatted)
 * @param codeHash SHA-256 hash of the code
 * @param timestamp When the code was registered
 * @param txHash Ethereum transaction hash
 * @returns PDF blob
 */
export function generateCertificatePdf(
  projectName: string,
  authorAddress: string,
  codeHash: string,
  timestamp: Date,
  txHash: string
): Blob {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set background color (dark professional background)
  doc.setFillColor(20, 20, 40);
  doc.rect(0, 0, 210, 297, "F");

  // Set text color to white
  doc.setTextColor(255, 255, 255);

  // Title
  doc.setFontSize(32);
  doc.setFont("Arial", "bold");
  doc.text("CODE CERTIFICATE", 105, 40, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("Arial");
  doc.text("Proof of Code Authorship", 105, 50, { align: "center" });

  // Border
  doc.setDrawColor(100, 150, 255);
  doc.setLineWidth(0.5);
  doc.rect(15, 60, 180, 200);

  // Content
  doc.setFontSize(11);
  doc.setFont("Arial", "bold");

  let yPos = 75;
  const lineHeight = 10;

  doc.text("Project Name:", 25, yPos);
  doc.setFont("Arial", "normal");
  const projectNameX = doc.getTextWidth("Project Name:") + 26;
  doc.text(projectName, projectNameX, yPos);

  yPos += lineHeight;
  doc.setFont("Arial", "bold");
  doc.text("Author Address:", 25, yPos);
  doc.setFont("Arial", "normal");
  doc.text(authorAddress, projectNameX, yPos);

  yPos += lineHeight * 1.5;
  doc.setFont("Arial", "bold");
  doc.text("Code Hash (SHA-256):", 25, yPos);
  doc.setFont("Arial", "normal");
  doc.setFontSize(9);

  // Wrap long hash
  const hashLines = doc.splitTextToSize(codeHash, 160);
  doc.text(hashLines, 25, yPos + 5);

  yPos += lineHeight * 3;
  doc.setFontSize(11);
  doc.setFont("Arial", "bold");
  doc.text("Registration Date & Time:", 25, yPos);
  doc.setFont("Arial", "normal");
  doc.text(timestamp.toLocaleString(), projectNameX, yPos);

  yPos += lineHeight;
  doc.setFont("Arial", "bold");
  doc.text("Transaction Hash:", 25, yPos);
  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  const txHashLines = doc.splitTextToSize(txHash, 160);
  doc.text(txHashLines, 25, yPos + 5);

  yPos += lineHeight * 4;
  doc.setFontSize(10);
  doc.setFont("Arial", "italic");
  doc.text(
    "This certificate proves the authenticity and timestamp of the code on the Ethereum blockchain.",
    105,
    yPos,
    { align: "center" }
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text("CodeProof - Blockchain Code Authentication", 105, 285, {
    align: "center",
  });

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
