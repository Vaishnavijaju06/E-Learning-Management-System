import { jsPDF } from "jspdf";

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export const downloadPaymentInvoice = (payment) => {
  if (!payment) {
    throw new Error("Payment information is unavailable");
  }

  const document = new jsPDF();

  document.setFillColor(79, 70, 229);
  document.rect(0, 0, 210, 38, "F");

  document.setTextColor(255, 255, 255);
  document.setFontSize(24);
  document.setFont("helvetica", "bold");
  document.text("SkillForge", 15, 18);

  document.setFontSize(11);
  document.setFont("helvetica", "normal");
  document.text("Payment Invoice", 15, 28);

  document.setTextColor(33, 37, 41);
  document.setFontSize(16);
  document.setFont("helvetica", "bold");
  document.text("INVOICE", 15, 55);

  document.setFontSize(10);
  document.setFont("helvetica", "normal");

  document.text(
    `Invoice number: ${payment.invoiceNumber}`,
    15,
    66
  );

  document.text(
    `Payment ID: ${payment.id}`,
    15,
    73
  );

  document.text(
    `Order ID: ${payment.orderId}`,
    15,
    80
  );

  document.text(
    `Payment date: ${new Date(
      payment.paidAt
    ).toLocaleString("en-IN")}`,
    15,
    87
  );

  document.setFont("helvetica", "bold");
  document.text("Billed To", 130, 55);

  document.setFont("helvetica", "normal");
  document.text(payment.customerName, 130, 66);
  document.text(payment.customerEmail, 130, 73);

  if (payment.customerPhone) {
    document.text(payment.customerPhone, 130, 80);
  }

  document.setFillColor(245, 247, 250);
  document.roundedRect(15, 100, 180, 25, 3, 3, "F");

  document.setFont("helvetica", "bold");
  document.text("Course", 20, 110);
  document.text("Amount", 165, 110);

  document.setFont("helvetica", "normal");

  const courseLines = document.splitTextToSize(
    payment.courseTitle,
    115
  );

  document.text(courseLines, 20, 118);

  document.text(
    formatCurrency(payment.coursePrice),
    165,
    118
  );

  let rowPosition = 145;

  const addPriceRow = (label, amount) => {
    document.text(label, 115, rowPosition);

    document.text(
      formatCurrency(amount),
      165,
      rowPosition
    );

    rowPosition += 9;
  };

  addPriceRow("Course price", payment.coursePrice);

  if (payment.couponDiscount > 0) {
    addPriceRow(
      "Coupon discount",
      -payment.couponDiscount
    );
  }

  addPriceRow("Tax (GST 18%)", payment.tax);

  document.setDrawColor(210, 214, 220);
  document.line(115, rowPosition, 190, rowPosition);

  rowPosition += 10;

  document.setFont("helvetica", "bold");
  document.setFontSize(12);
  document.text("Total paid", 115, rowPosition);

  document.text(
    formatCurrency(payment.amount),
    165,
    rowPosition
  );

  document.setTextColor(25, 135, 84);
  document.setFontSize(11);
  document.text(
    `Payment status: ${payment.status}`,
    15,
    200
  );

  document.setTextColor(108, 117, 125);
  document.setFontSize(9);
  document.setFont("helvetica", "normal");

  document.text(
    "This is a computer-generated invoice and does not require a signature.",
    15,
    270
  );

  document.text(
    "Thank you for learning with SkillForge.",
    15,
    278
  );

  document.save(`${payment.invoiceNumber}.pdf`);
};