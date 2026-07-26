import jsPDF from "jspdf";
import QRCode from "qrcode";

import {
  getCertificateByNumber,
  studentCertificates,
} from "../data/studentCertificates";

export const getStudentCertificates = () => {
  return studentCertificates;
};

export const getCertificate = (certificateNumber) => {
  return getCertificateByNumber(certificateNumber);
};

export const downloadCertificate = async (certificate) => {
  if (!certificate?.certificateAvailable) {
    throw new Error("Certificate is not available.");
  }

  const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.certificateNumber}`;

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 300,
    margin: 1,
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Certificate background
  pdf.setFillColor(255, 253, 246);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Outer borders
  pdf.setDrawColor(183, 121, 31);
  pdf.setLineWidth(2);
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

  pdf.setLineWidth(0.5);
  pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Brand
  pdf.setTextColor(79, 70, 229);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("SkillForge", pageWidth / 2, 28, {
    align: "center",
  });

  // Certificate heading
  pdf.setTextColor(183, 121, 31);
  pdf.setFont("times", "bold");
  pdf.setFontSize(34);
  pdf.text("Certificate of Completion", pageWidth / 2, 50, {
    align: "center",
  });

  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(
    "This certificate is proudly presented to",
    pageWidth / 2,
    67,
    { align: "center" }
  );

  // Student name
  pdf.setTextColor(79, 70, 229);
  pdf.setFont("times", "bold");
  pdf.setFontSize(29);
  pdf.text(certificate.studentName, pageWidth / 2, 85, {
    align: "center",
  });

  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(
    "for successfully completing the course",
    pageWidth / 2,
    99,
    { align: "center" }
  );

  // Course name
  pdf.setTextColor(31, 41, 55);
  pdf.setFont("times", "bold");
  pdf.setFontSize(22);

  const courseTitleLines = pdf.splitTextToSize(
    certificate.courseTitle,
    190
  );

  pdf.text(courseTitleLines, pageWidth / 2, 115, {
    align: "center",
  });

  // Score
  pdf.setTextColor(75, 85, 99);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(
    `Successfully fulfilled all course requirements with a final score of ${certificate.score}%.`,
    pageWidth / 2,
    137,
    { align: "center" }
  );

  // Instructor details
  pdf.setDrawColor(55, 65, 81);
  pdf.line(35, 166, 105, 166);

  pdf.setTextColor(31, 41, 55);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(certificate.instructorName, 70, 173, {
    align: "center",
  });

  pdf.setTextColor(107, 114, 128);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Course Instructor", 70, 179, {
    align: "center",
  });

  // Issue date
  pdf.setDrawColor(55, 65, 81);
  pdf.line(192, 166, 262, 166);

  pdf.setTextColor(31, 41, 55);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(certificate.issueDate, 227, 173, {
    align: "center",
  });

  pdf.setTextColor(107, 114, 128);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Date Issued", 227, 179, {
    align: "center",
  });

  // QR verification
  pdf.addImage(qrCodeDataUrl, "PNG", 137, 150, 23, 23);

  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(7);
  pdf.text("Scan to verify", pageWidth / 2, 178, {
    align: "center",
  });

  // Footer
  pdf.setFontSize(8);
  pdf.text(
    `Certificate ID: ${certificate.certificateNumber}`,
    18,
    195
  );

  pdf.text("Verified by SkillForge", pageWidth - 18, 195, {
    align: "right",
  });

  pdf.save(`${certificate.certificateNumber}.pdf`);
};