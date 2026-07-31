import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", {
        replace: true
      });
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Invalid email or password"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg auth-card">
              <div className="card-body p-4 p-lg-5">
                <div className="text-center mb-4">
                  <span className="brand-mark large">S</span>
                  <h1 className="h3 fw-bold mt-3">Welcome back</h1>
                  <p className="text-secondary">
                    Sign in to continue learning
                  </p>
                </div>

                <AlertMessage>{error}</AlertMessage>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
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

                  <div className="mb-4">
                    <label className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
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
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <p className="text-center small mt-4 mb-0">
                  New to SkillForge?{" "}
                  <Link to="/register">Create an account</Link>
                </p>

                <div className="demo-credentials mt-4">
                  <strong>Demo accounts</strong>
                  <div>Admin: admin@skillforge.local / Admin@123</div>
                  <div>
                    Instructor: instructor@skillforge.local /
                    Instructor@123
                  </div>
                  <div>
                    Student: student@skillforge.local / Student@123
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
