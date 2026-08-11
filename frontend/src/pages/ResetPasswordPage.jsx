import { useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { authApi } from "../api/skillforgeApi";
import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import StatusModal from "../components/StatusModal";
import { useToast } from "../context/ToastContext";

export default function ResetPasswordPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);
  const [successModal, setSuccessModal] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      const message =
        "This reset link is missing its token. "
        + "Please use the link from your email.";
      setError(message);
      toast.error(message);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.resetPassword(
        token,
        form.newPassword
      );

      setSuccessModal(
        response.data?.message
          || "Your password has been reset. You can now log in."
      );
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        "Unable to reset your password right now"
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
                    Set a new password
                  </h2>
                  <p className="text-secondary mb-0">
                    Choose a new password for your account.
                  </p>
                </div>

                {!token && (
                  <div
                    className="alert alert-warning py-2 small"
                    role="alert"
                  >
                    This link is missing a reset token. Open it
                    directly from the email we sent you, or{" "}
                    <Link to="/forgot-password">
                      request a new link
                    </Link>
                    .
                  </div>
                )}

                <AlertMessage>{error}</AlertMessage>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={
                          showPassword ? "text" : "password"
                        }
                        className="form-control pe-5"
                        placeholder="Minimum 8 characters"
                        minLength="8"
                        required
                        value={form.newPassword}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            newPassword: event.target.value
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn password-toggle-btn position-absolute top-50 end-0 translate-middle-y"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        tabIndex={-1}
                      >
                        <i
                          className={`bi ${
                            showPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Confirm New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        className={`form-control pe-5${
                          form.confirmPassword
                            && form.newPassword
                              !== form.confirmPassword
                            ? " is-invalid"
                            : ""
                        }`}
                        placeholder="Re-enter your new password"
                        minLength="8"
                        required
                        value={form.confirmPassword}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            confirmPassword: event.target.value
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn password-toggle-btn position-absolute top-50 end-0 translate-middle-y"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        tabIndex={-1}
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>
                      {form.confirmPassword
                        && form.newPassword
                          !== form.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            Passwords do not match.
                          </div>
                        )}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100 py-2"
                    disabled={
                      loading
                      || !token
                      || (form.confirmPassword
                        && form.newPassword
                          !== form.confirmPassword)
                    }
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Resetting password...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <i className="bi bi-arrow-right ms-2"></i>
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
          title="Password reset"
          message={successModal}
          confirmLabel="Go to Login"
          onClose={() => navigate("/login")}
        />
      )}
    </div>
  );
}