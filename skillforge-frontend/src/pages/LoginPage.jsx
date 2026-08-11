import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loggedInUser = await login(form);
      toast.success(
        `Welcome back${
          loggedInUser?.firstName
            ? `, ${loggedInUser.firstName}`
            : ""
        }!`
      );
      navigate(location.state?.from || "/dashboard", {
        replace: true
      });
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        "Invalid email or password"
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
          <div className="col-lg-5 d-none d-lg-block">
            <span className="section-eyebrow">
              Welcome back
            </span>
            <h1 className="display-5 fw-bold mt-2 mb-3">
              Continue building your future.
            </h1>
            <p className="text-secondary fs-5">
              Access your courses, assignments, discussions and
              certificates from one secure dashboard.
            </p>
            <div className="d-grid gap-3 mt-4">
              {[
                ["bi-shield-check", "Secure role-based access"],
                ["bi-graph-up-arrow", "Track learning progress"],
                ["bi-award", "Earn verified certificates"]
              ].map(([icon, text]) => (
                <div
                  className="d-flex align-items-center gap-3"
                  key={text}
                >
                  <div className="feature-icon-box mb-0">
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <strong>{text}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-8 col-lg-5">
            <div className="card border-0 auth-card position-relative">
              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-4">
                  <span className="brand-mark large">S</span>
                  <h2 className="h3 fw-bold mt-3 mb-1">
                    Sign in to SkillForge
                  </h2>
                  <p className="text-secondary mb-0">
                    Enter your credentials to continue
                  </p>
                </div>

                <AlertMessage>{error}</AlertMessage>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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
                        value={form.email}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            email: event.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="small fw-semibold"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="position-relative">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          className="form-control border-start-0 pe-5"
                          placeholder="Enter your password"
                          required
                          value={form.password}
                          onChange={(event) =>
                            setForm({
                              ...form,
                              password: event.target.value
                            })
                          }
                        />
                      </div>
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

                  <button
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <i className="bi bi-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center small mt-4 mb-0">
                  New to SkillForge?{" "}
                  <Link to="/register" className="fw-semibold">
                    Create an account
                  </Link>
                </p>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}