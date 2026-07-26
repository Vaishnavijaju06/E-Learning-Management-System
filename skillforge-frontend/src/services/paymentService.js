const PAYMENT_STORAGE_KEY = "skillforge-payments";

const delay = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const generatePaymentId = () =>
  `pay_demo_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const generateOrderId = () => `order_demo_${Date.now()}`;

const generateInvoiceNumber = () =>
  `SF-INV-${new Date().getFullYear()}-${Date.now()
    .toString()
    .slice(-6)}`;

const readPayments = () => {
  try {
    return JSON.parse(
      localStorage.getItem(PAYMENT_STORAGE_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

export const calculateCheckoutAmount = (
  course,
  couponCode = ""
) => {
  const coursePrice = Number(course?.sellingPrice || 0);

  const couponDiscount =
    couponCode.toUpperCase() === "SKILL20"
      ? Math.round(coursePrice * 0.2)
      : 0;

  const taxableAmount = coursePrice - couponDiscount;
  const tax = Math.round(taxableAmount * 0.18);

  return {
    coursePrice,
    couponDiscount,
    taxableAmount,
    tax,
    total: taxableAmount + tax,
  };
};

export const processDemoPayment = async ({
  course,
  customer,
  amounts,
}) => {
  await delay(1500);

  if (!course || !customer?.email) {
    throw new Error("Invalid payment information");
  }

  const payment = {
    id: generatePaymentId(),
    orderId: generateOrderId(),
    invoiceNumber: generateInvoiceNumber(),
    courseId: course.id,
    courseTitle: course.title,
    instructorName: course.instructorName,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    coursePrice: amounts.coursePrice,
    couponDiscount: amounts.couponDiscount,
    taxableAmount: amounts.taxableAmount,
    tax: amounts.tax,
    amount: amounts.total,
    currency: "INR",
    status: "PAID",
    paymentMethod: "Razorpay Demo",
    paidAt: new Date().toISOString(),
  };

  const previousPayments = readPayments();

  localStorage.setItem(
    PAYMENT_STORAGE_KEY,
    JSON.stringify([payment, ...previousPayments])
  );

  return payment;
};

export const getStoredPayments = () => readPayments();

export const getPaymentById = (paymentId) =>
  readPayments().find(
    (payment) => payment.id === paymentId
  );