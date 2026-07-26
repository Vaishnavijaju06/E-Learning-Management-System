import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

import { createEnrollmentFromPayment } from "../../services/enrollmentService";
import { downloadPaymentInvoice } from "../../services/invoiceService";
import { getPaymentById } from "../../services/paymentService";

function PaymentSuccessPage() {
  const { paymentId } = useParams();
  const location = useLocation();

  const payment =
    location.state?.payment ||
    getPaymentById(paymentId);

  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    if (!payment) {
      return;
    }

    try {
      const createdEnrollment =
        createEnrollmentFromPayment(payment);

      setEnrollment(createdEnrollment);
    } catch (error) {
      toast.error(error.message);
    }
  }, [payment]);

  if (!payment) {
    return (
      <main className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">
            Payment not found
          </h4>

          <p>
            We could not find the requested payment
            information.
          </p>

          <Link
            to="/student/payments"
            className="btn btn-outline-danger"
          >
            View Payment History
          </Link>
        </div>
      </main>
    );
  }

  const handleInvoiceDownload = () => {
    try {
      downloadPaymentInvoice(payment);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <section className="payment-success-card">
        <div className="payment-success-icon">
          <i className="bi bi-check-lg"></i>
        </div>

        <span className="badge text-bg-success mb-3">
          Payment successful
        </span>

        <h1 className="fw-bold">
          You are successfully enrolled!
        </h1>

        <p className="text-secondary">
          Your payment was completed and the course has
          been added to your learning dashboard.
        </p>

        <div className="payment-success-course">
          <span>Course</span>
          <strong>{payment.courseTitle}</strong>
        </div>

        <div className="payment-success-details">
          <DetailRow
            label="Payment ID"
            value={payment.id}
          />

          <DetailRow
            label="Order ID"
            value={payment.orderId}
          />

          <DetailRow
            label="Invoice number"
            value={payment.invoiceNumber}
          />

          <DetailRow
            label="Payment method"
            value={payment.paymentMethod}
          />

          <DetailRow
            label="Payment date"
            value={new Date(
              payment.paidAt
            ).toLocaleString("en-IN")}
          />

          <DetailRow
            label="Total paid"
            value={`₹${payment.amount.toLocaleString(
              "en-IN"
            )}`}
          />

          <DetailRow
            label="Enrollment status"
            value={enrollment?.status || "Creating…"}
            success
          />
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
          <Link
            to="/student/my-courses"
            className="btn btn-primary-custom"
          >
            <i className="bi bi-play-circle me-2"></i>
            Start Learning
          </Link>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleInvoiceDownload}
          >
            <i className="bi bi-download me-2"></i>
            Download Invoice
          </button>

          <Link
            to="/student/payments"
            className="btn btn-outline-secondary"
          >
            Payment History
          </Link>
        </div>
      </section>
    </main>
  );
}

function DetailRow({
  label,
  value,
  success = false,
}) {
  return (
    <div className="payment-detail-row">
      <span>{label}</span>

      <strong className={success ? "text-success" : ""}>
        {value}
      </strong>
    </div>
  );
}

export default PaymentSuccessPage;