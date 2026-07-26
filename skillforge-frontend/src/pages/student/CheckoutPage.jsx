import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCheckoutCourseById } from "../../data/checkoutCourses";
import {
  calculateCheckoutAmount,
  processDemoPayment,
} from "../../services/paymentService";

function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = getCheckoutCourseById(courseId);

  const [customer, setCustomer] = useState({
    name: "Garv Gupta",
    email: "garv.gupta@example.com",
    phone: "9876543210",
  });

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const amounts = useMemo(
    () => calculateCheckoutAmount(course, appliedCoupon),
    [course, appliedCoupon]
  );

  if (!course) {
    return (
      <main className="container-fluid p-4">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Course not found</h4>
          <p className="mb-0">
            The selected course is unavailable for checkout.
          </p>
        </div>
      </main>
    );
  }

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;

    setCustomer((currentCustomer) => ({
      ...currentCustomer,
      [name]: value,
    }));
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      toast.info("Enter a coupon code");
      return;
    }

    if (code !== "SKILL20") {
      setAppliedCoupon("");
      toast.error("Invalid coupon code");
      return;
    }

    setAppliedCoupon(code);
    toast.success("Coupon applied successfully");
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setAppliedCoupon("");
    toast.info("Coupon removed");
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      setProcessing(true);

      const payment = await processDemoPayment({
        course,
        customer,
        amounts,
      });

      toast.success("Payment completed successfully");

      navigate(`/student/payment-success/${payment.id}`, {
        state: {
          payment,
        },
      });
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Secure Checkout</h1>

        <p className="text-secondary mb-0">
          Complete your purchase and start learning.
        </p>
      </div>

      <form onSubmit={handlePayment}>
        <div className="row g-4">
          <div className="col-lg-7">
            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">
                  Billing Information
                </h4>

                <div className="row g-3">
                  <div className="col-12">
                    <label
                      htmlFor="customerName"
                      className="form-label"
                    >
                      Full name
                    </label>

                    <input
                      id="customerName"
                      type="text"
                      name="name"
                      className="form-control"
                      value={customer.name}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="customerEmail"
                      className="form-label"
                    >
                      Email
                    </label>

                    <input
                      id="customerEmail"
                      type="email"
                      name="email"
                      className="form-control"
                      value={customer.email}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="customerPhone"
                      className="form-label"
                    >
                      Phone
                    </label>

                    <input
                      id="customerPhone"
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={customer.phone}
                      onChange={handleCustomerChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="checkout-security-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Secure Payment
                    </h4>

                    <p className="text-secondary mb-0">
                      Payment is securely processed through Razorpay.
                    </p>
                  </div>
                </div>

                <div className="checkout-payment-method">
                  <div>
                    <i className="bi bi-credit-card me-2"></i>
                    <strong>Razorpay Checkout</strong>
                  </div>

                  <span className="badge text-bg-success">
                    Secure
                  </span>
                </div>

                <p className="small text-secondary mt-3 mb-0">
                  You can pay using UPI, card, net banking or supported
                  wallets.
                </p>
              </div>
            </section>
          </div>

          <div className="col-lg-5">
            <section className="card border-0 shadow-sm rounded-4 checkout-summary-card">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="checkout-course">
                  <img
                    src={course.image}
                    alt={course.title}
                  />

                  <div>
                    <h6 className="fw-bold">{course.title}</h6>

                    <p className="text-secondary small mb-1">
                      By {course.instructorName}
                    </p>

                    <span className="badge text-bg-light">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="input-group mt-4">
                  <input
                    type="text"
                    className="form-control"
                    value={couponInput}
                    onChange={(event) =>
                      setCouponInput(event.target.value)
                    }
                    placeholder="Coupon code"
                    disabled={Boolean(appliedCoupon)}
                  />

                  {appliedCoupon ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  )}
                </div>

                {appliedCoupon && (
                  <div className="alert alert-success py-2 mt-3 mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    SKILL20 applied
                  </div>
                )}

                <div className="checkout-price-details mt-4">
                  <PriceRow
                    label="Course price"
                    value={amounts.coursePrice}
                  />

                  {amounts.couponDiscount > 0 && (
                    <PriceRow
                      label="Coupon discount"
                      value={-amounts.couponDiscount}
                      discount
                    />
                  )}

                  <PriceRow
                    label="GST (18%)"
                    value={amounts.tax}
                  />

                  <div className="checkout-total">
                    <span>Total</span>
                    <strong>
                      ₹{amounts.total.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="form-check mt-4">
                  <input
                    id="checkoutTerms"
                    type="checkbox"
                    className="form-check-input"
                    checked={termsAccepted}
                    onChange={(event) =>
                      setTermsAccepted(event.target.checked)
                    }
                  />

                  <label
                    htmlFor="checkoutTerms"
                    className="form-check-label small"
                  >
                    I agree to the terms, privacy policy and refund
                    policy.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom btn-lg w-100 mt-4"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-lock-fill me-2"></i>
                      Pay ₹{amounts.total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <p className="checkout-secure-text">
                  <i className="bi bi-shield-lock me-1"></i>
                  Your payment information is protected.
                </p>
              </div>
            </section>
          </div>
        </div>
      </form>
    </main>
  );
}

function PriceRow({ label, value, discount = false }) {
  const absoluteValue = Math.abs(value);

  return (
    <div className="checkout-price-row">
      <span>{label}</span>

      <strong className={discount ? "text-success" : ""}>
        {value < 0 ? "−" : ""}₹
        {absoluteValue.toLocaleString("en-IN")}
      </strong>
    </div>
  );
}

export default CheckoutPage;