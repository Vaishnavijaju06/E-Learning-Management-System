import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/skillforgeApi";
import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import StatusModal from "../components/StatusModal";
import { useToast } from "../context/ToastContext";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.forgotPassword(email);

      setSuccessModal(
        response.data?.message
          || "If an account exists for that email, a password reset link has been sent."
      );
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        "Unable to send the reset link right now"
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center g-5">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 auth-card position-relative">
              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-4">
                  <span className="brand-mark large">S</span>
                  <h2 className="h3 fw-bold mt-3 mb-1">
                    Forgot your password?
                  </h2>
                  <p className="text-secondary mb-0">
                    Enter your account email and we'll send you a
                    link to reset it.
                  </p>
                </div>

                <AlertMessage>{error}</AlertMessage>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <i className="bi bi-send ms-2"></i>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center small mt-4 mb-0">
                  Remembered your password?{" "}
                  <Link to="/login" className="fw-semibold">
                    Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successModal && (
        <StatusModal
          type="success"
          title="Check your email"
          message={successModal}
          confirmLabel="Back to Login"
          onClose={() => {
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}