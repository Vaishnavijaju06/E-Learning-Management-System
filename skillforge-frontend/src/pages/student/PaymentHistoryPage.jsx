import { useState } from "react";
import { toast } from "react-toastify";

import { downloadPaymentInvoice } from "../../services/invoiceService";
import { getStoredPayments } from "../../services/paymentService";

function PaymentHistoryPage() {
  const [payments] = useState(() =>
    getStoredPayments()
  );

  const handleDownload = (payment) => {
    try {
      downloadPaymentInvoice(payment);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">
          Payments and Invoices
        </h1>

        <p className="text-secondary mb-0">
          Review your course purchases and download
          invoices.
        </p>
      </div>

      {payments.length === 0 ? (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-receipt fs-1 text-secondary"></i>

            <h4 className="fw-bold mt-3">
              No payments found
            </h4>

            <p className="text-secondary mb-0">
              Your completed course purchases will appear
              here.
            </p>
          </div>
        </section>
      ) : (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Course</th>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>
                        {payment.courseTitle}
                      </strong>

                      <small className="d-block text-secondary">
                        {payment.paymentMethod}
                      </small>
                    </td>

                    <td>{payment.invoiceNumber}</td>

                    <td>
                      {new Date(
                        payment.paidAt
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      ₹{payment.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <span className="badge text-bg-success">
                        {payment.status}
                      </span>
                    </td>

                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          handleDownload(payment)
                        }
                      >
                        <i className="bi bi-download me-1"></i>
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default PaymentHistoryPage;