import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required.";
    }

    return validationErrors;
  };

  const getDashboardPath = (user) => {
    if (user.role === "ADMIN") {
      return "/admin/dashboard";
    }

    if (user.role === "INSTRUCTOR") {
      return "/instructor/dashboard";
    }

    return "/student/dashboard";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      const loggedInUser = await login(
        formData.email,
        formData.password
      );

      toast.success(
        `Welcome back, ${loggedInUser.firstName}!`
      );

      const requestedPage = location.state?.from;
      const dashboardPath = getDashboardPath(loggedInUser);

      navigate(requestedPage || dashboardPath, {
        replace: true,
      });
    } catch (error) {
      setErrors({
        form: error.message || "Unable to log in.",
      });

      toast.error(error.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillStudentCredentials = () => {
    setFormData({
      email: "student@skillforge.com",
      password: "Student@123",
      rememberMe: true,
    });

    setErrors({});
  };

  return (
    <main className="section-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-5 bg-dark text-white p-5 d-none d-lg-flex flex-column justify-content-center">
                  <i className="bi bi-mortarboard-fill display-3 text-primary mb-4"></i>

                  <h2 className="fw-bold">
                    Continue learning with SkillForge
                  </h2>

                  <p className="text-white-50">
                    Access your courses, track progress, complete
                    quizzes and earn certificates.
                  </p>

                  <div className="mt-4">
                    <p>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Track course progress
                    </p>

                    <p>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Continue lessons anytime
                    </p>

                    <p>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Earn verified certificates
                    </p>
                  </div>
                </div>

                <div className="col-lg-7 bg-white p-4 p-md-5">
                  <div className="mb-4">
                    <h1 className="fw-bold">Welcome Back</h1>

                    <p className="text-secondary">
                      Sign in to continue to your account.
                    </p>
                  </div>

                  {errors.form && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.form}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="email"
                      >
                        Email Address
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="bi bi-envelope"></i>
                        </span>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      {errors.email && (
                        <div className="text-danger small mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="password"
                      >
                        Password
                      </label>

                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <i className="bi bi-lock"></i>
                        </span>

                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setShowPassword((current) => !current)
                          }
                          aria-label="Show or hide password"
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

                      {errors.password && (
                        <div className="text-danger small mt-1">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />

                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Remember me
                        </label>
                      </div>

                      <Link to="/forgot-password">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary-custom w-100 py-3"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center my-4">
                    <span className="text-secondary">
                      New to SkillForge?{" "}
                    </span>

                    <Link to="/register" className="fw-semibold">
                      Create an account
                    </Link>
                  </div>

                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <h6 className="fw-bold">
                        Student demonstration account
                      </h6>

                      <p className="small mb-1">
                        Email: student@skillforge.com
                      </p>

                      <p className="small mb-3">
                        Password: Student@123
                      </p>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={fillStudentCredentials}
                      >
                        Use Student Credentials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;