import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import authService from "../../services/authServices";

const initialForm = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      submit: "",
    }));
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();

    if (!email) {
      setErrors({
        email: "Email address is required.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({
        email: "Enter a valid email address.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const resetData =
        await authService.generateResetOtp(email);

      setGeneratedOtp(resetData.otp);
      setOtpExpiresAt(resetData.expiresAt);
      setCurrentStep(2);

      /*
       * This displays the OTP only because there is no backend/email
       * service yet. Remove this when connecting the real backend.
       */
      toast.info(`Demo OTP: ${resetData.otp}`, {
        autoClose: 10000,
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Unable to generate OTP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();

    const enteredOtp = formData.otp.trim();

    if (!enteredOtp) {
      setErrors({
        otp: "OTP is required.",
      });
      return;
    }

    if (!/^\d{6}$/.test(enteredOtp)) {
      setErrors({
        otp: "Enter the six-digit OTP.",
      });
      return;
    }

    if (!otpExpiresAt || Date.now() > otpExpiresAt) {
      setErrors({
        submit: "OTP has expired. Please request a new OTP.",
      });
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setErrors({
        otp: "The entered OTP is incorrect.",
      });
      return;
    }

    setErrors({});
    setCurrentStep(3);
    toast.success("OTP verified successfully.");
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      const resetData = await authService.generateResetOtp(
        formData.email
      );

      setGeneratedOtp(resetData.otp);
      setOtpExpiresAt(resetData.expiresAt);

      setFormData((currentForm) => ({
        ...currentForm,
        otp: "",
      }));

      toast.info(`New demo OTP: ${resetData.otp}`, {
        autoClose: 10000,
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Unable to resend OTP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = () => {
    const validationErrors = {};

    if (!formData.newPassword) {
      validationErrors.newPassword =
        "New password is required.";
    } else if (formData.newPassword.length < 8) {
      validationErrors.newPassword =
        "Password must contain at least 8 characters.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(
        formData.newPassword
      )
    ) {
      validationErrors.newPassword =
        "Use uppercase, lowercase, number and special character.";
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      formData.newPassword !== formData.confirmPassword
    ) {
      validationErrors.confirmPassword =
        "Passwords do not match.";
    }

    return validationErrors;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validatePassword();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await authService.resetPassword(
        formData.email,
        formData.newPassword
      );

      toast.success(
        "Password reset successfully. Please log in."
      );

      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: formData.email
            .trim()
            .toLowerCase(),
        },
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Password reset failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`rounded-circle d-flex align-items-center justify-content-center ${
            currentStep >= step
              ? "bg-primary text-white"
              : "bg-light text-secondary"
          }`}
          style={{
            width: "36px",
            height: "36px",
            fontWeight: "600",
          }}
        >
          {step}
        </span>
      ))}
    </div>
  );

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-9 col-lg-6">
          <section className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="badge text-bg-primary mb-3">
                  Account Recovery
                </span>

                <h1 className="h2 fw-bold">
                  Reset your password
                </h1>

                <p className="text-secondary mb-0">
                  Verify your account and create a new
                  password.
                </p>
              </div>

              {renderStepIndicator()}

              {errors.submit && (
                <div className="alert alert-danger">
                  {errors.submit}
                </div>
              )}

              {currentStep === 1 && (
                <form onSubmit={handleEmailSubmit} noValidate>
                  <label
                    htmlFor="email"
                    className="form-label"
                  >
                    Registered email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />

                  <div className="invalid-feedback">
                    {errors.email}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Checking email...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-check me-2"></i>
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              )}

              {currentStep === 2 && (
                <form onSubmit={handleOtpSubmit} noValidate>
                  <div className="alert alert-info">
                    A demo OTP was generated for{" "}
                    <strong>{formData.email}</strong>.
                  </div>

                  <label htmlFor="otp" className="form-label">
                    Enter six-digit OTP
                  </label>

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    className={`form-control text-center fs-4 ${
                      errors.otp ? "is-invalid" : ""
                    }`}
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="000000"
                  />

                  <div className="invalid-feedback">
                    {errors.otp}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3 mt-4"
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    Verify OTP
                  </button>

                  <button
                    type="button"
                    className="btn btn-link w-100 mt-2"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {currentStep === 3 && (
                <form
                  onSubmit={handlePasswordSubmit}
                  noValidate
                >
                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className="form-label"
                    >
                      New password
                    </label>

                    <div className="input-group">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={
                          showPassword ? "text" : "password"
                        }
                        className={`form-control ${
                          errors.newPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        <i
                          className={`bi ${
                            showPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>

                      <div className="invalid-feedback">
                        {errors.newPassword}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label"
                    >
                      Confirm new password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showPassword ? "text" : "password"
                      }
                      className={`form-control ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                    />

                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  </div>

                  <p className="small text-secondary">
                    Use at least eight characters with uppercase,
                    lowercase, number and special character.
                  </p>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100 py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating password...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-key me-2"></i>
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-center text-secondary mt-4 mb-0">
                Remember your password?{" "}
                <Link to="/login" className="fw-semibold">
                  Return to login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;