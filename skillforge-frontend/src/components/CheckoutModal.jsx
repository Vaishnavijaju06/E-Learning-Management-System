import { useState } from "react";

export default function CheckoutModal({
  course,
  user,
  processing,
  error,
  onClose,
  onConfirm
}) {
  const isFree = Number(course.price) === 0;
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("student@upi");
  const [cardNumber, setCardNumber] = useState(
    "4242 4242 4242 4242"
  );
  const [expiry, setExpiry] = useState("12/30");
  const [cvv, setCvv] = useState("123");

  function submit(event) {
    event.preventDefault();
    onConfirm();
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <div>
                <h2
                  id="checkout-title"
                  className="modal-title h5 mb-1"
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  {isFree
                    ? "Confirm enrollment"
                    : "Mock payment checkout"}
                </h2>

                <p className="small text-secondary mb-0">
                  SkillForge academic payment demonstration
                </p>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={processing}
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <p className="fw-semibold mb-1">
                        {course.title}
                      </p>

                      <p className="small text-secondary mb-0">
                        Student: {user.email}
                      </p>
                    </div>

                    <p className="fw-bold text-primary mb-0">
                      {isFree
                        ? "Free"
                        : `₹${Number(course.price).toFixed(0)}`}
                    </p>
                  </div>
                </div>

                {!isFree && (
                  <>
                    <div
                      className="alert alert-warning py-2 small"
                      role="alert"
                    >
                      This is a simulated payment. Do not enter real
                      banking or card information.
                    </div>

                    <p className="form-label fw-semibold">
                      Choose payment method
                    </p>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <input
                          type="radio"
                          className="btn-check"
                          name="paymentMethod"
                          id="payment-upi"
                          checked={paymentMethod === "UPI"}
                          onChange={() => setPaymentMethod("UPI")}
                        />

                        <label
                          className="btn btn-outline-primary w-100"
                          htmlFor="payment-upi"
                        >
                          <i className="bi bi-phone me-2"></i>
                          UPI
                        </label>
                      </div>

                      <div className="col-6">
                        <input
                          type="radio"
                          className="btn-check"
                          name="paymentMethod"
                          id="payment-card"
                          checked={paymentMethod === "CARD"}
                          onChange={() => setPaymentMethod("CARD")}
                        />

                        <label
                          className="btn btn-outline-primary w-100"
                          htmlFor="payment-card"
                        >
                          <i className="bi bi-credit-card me-2"></i>
                          Card
                        </label>
                      </div>
                    </div>

                    {paymentMethod === "UPI" ? (
                      <div>
                        <label
                          htmlFor="upi-id"
                          className="form-label"
                        >
                          Demo UPI ID
                        </label>

                        <input
                          id="upi-id"
                          className="form-control"
                          value={upiId}
                          pattern="^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$"
                          required
                          onChange={(event) =>
                            setUpiId(event.target.value)
                          }
                        />

                        <div className="form-text">
                          Use the sample value for this demonstration.
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3">
                        <div className="col-12">
                          <label
                            htmlFor="card-number"
                            className="form-label"
                          >
                            Demo card number
                          </label>

                          <input
                            id="card-number"
                            className="form-control"
                            value={cardNumber}
                            pattern="[0-9 ]{19}"
                            required
                            onChange={(event) =>
                              setCardNumber(event.target.value)
                            }
                          />
                        </div>

                        <div className="col-6">
                          <label
                            htmlFor="card-expiry"
                            className="form-label"
                          >
                            Expiry
                          </label>

                          <input
                            id="card-expiry"
                            className="form-control"
                            value={expiry}
                            pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                            required
                            onChange={(event) =>
                              setExpiry(event.target.value)
                            }
                          />
                        </div>

                        <div className="col-6">
                          <label
                            htmlFor="card-cvv"
                            className="form-label"
                          >
                            CVV
                          </label>

                          <input
                            id="card-cvv"
                            className="form-control"
                            type="password"
                            value={cvv}
                            pattern="[0-9]{3}"
                            maxLength="3"
                            required
                            onChange={(event) =>
                              setCvv(event.target.value)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {error && (
                  <div
                    className="alert alert-danger mt-3 mb-0"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={processing}
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : isFree ? (
                    "Confirm Enrollment"
                  ) : (
                    `Pay ₹${Number(course.price).toFixed(0)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}