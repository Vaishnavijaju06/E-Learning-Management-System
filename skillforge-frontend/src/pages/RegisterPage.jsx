import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "STUDENT"
};

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = form;
      const user = await register(payload);
      const message =
        user.status === "PENDING"
          ? "Your account was created and is pending administrator approval before you can log in."
          : "Your account was created successfully. You can log in now.";

      toast.success(message);
      navigate("/login", {
        state: { message }
      });
    } catch (requestError) {
      const message = getErrorMessage(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-9">
            <div className="card border-0 auth-card position-relative">
              <div className="row g-0">
                <div className="col-lg-4 d-none d-lg-flex">
                  <div className="p-5 text-white w-100 d-flex flex-column justify-content-between rounded-start-4"
                    style={{
                      background:
                        "linear-gradient(145deg, #111827, #312e81)"
                    }}
                  >
                    <div>
                      <span className="brand-mark large">S</span>
                      <h2 className="fw-bold mt-4">
                        Join SkillForge
                      </h2>
                      <p className="opacity-75">
                        Create an account and begin your learning
                        journey today.
                      </p>
                    </div>

                    <div className="small opacity-75">
                      <p>
                        <i className="bi bi-check-circle-fill me-2 text-warning"></i>
                        Student access is immediate
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-check-circle-fill me-2 text-warning"></i>
                        Instructor accounts require approval
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="card-body p-4 p-lg-5">
                    <span className="section-eyebrow">
                      Create your account
                    </span>
                    <h1 className="h3 fw-bold mt-2">
                      Start learning with SkillForge
                    </h1>
                    <p className="text-secondary">
                      Fill in your details below. It only takes a
                      minute.
                    </p>

                    <AlertMessage>{error}</AlertMessage>

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            First name
                          </label>
                          <input
                            name="firstName"
                            className="form-control"
                            placeholder="First name"
                            required
                            value={form.firstName}
                            onChange={update}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Last name
                          </label>
                          <input
                            name="lastName"
                            className="form-control"
                            placeholder="Last name"
                            required
                            value={form.lastName}
                            onChange={update}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="name@example.com"
                            required
                            value={form.email}
                            onChange={update}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            name="phone"
                            className="form-control"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={update}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Password
                          </label>
                          <div className="position-relative">
                            <input
                              name="password"
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              className="form-control pe-5"
                              placeholder="Minimum 8 characters"
                              minLength="8"
                              required
                              value={form.password}
                              onChange={update}
                            />
                            <button
                              type="button"
                              className="btn password-toggle-btn position-absolute top-50 end-0 translate-middle-y"
                              onClick={() =>
                                setShowPassword(
                                  (current) => !current
                                )
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
                        <div className="col-md-6">
                          <label className="form-label">
                            Confirm Password
                          </label>
                          <div className="position-relative">
                            <input
                              name="confirmPassword"
                              type={
                                showConfirmPassword
                                  ? "text"
                                  : "password"
                              }
                              className={`form-control pe-5${
                                form.confirmPassword &&
                                form.password !==
                                  form.confirmPassword
                                  ? " is-invalid"
                                  : ""
                              }`}
                              placeholder="Re-enter your password"
                              minLength="8"
                              required
                              value={form.confirmPassword}
                              onChange={update}
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
                            {form.confirmPassword &&
                              form.password !==
                                form.confirmPassword && (
                                <div className="invalid-feedback d-block">
                                  Passwords do not match.
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Register as
                          </label>
                          <select
                            name="role"
                            className="form-select"
                            value={form.role}
                            onChange={update}
                          >
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">
                              Instructor
                            </option>
                          </select>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary w-100 mt-4 py-2"
                        disabled={
                          loading ||
                          (form.confirmPassword &&
                            form.password !==
                              form.confirmPassword)
                        }
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <i className="bi bi-arrow-right ms-2"></i>
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center small mt-4 mb-0">
                      Already registered?{" "}
                      <Link to="/login" className="fw-semibold">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}