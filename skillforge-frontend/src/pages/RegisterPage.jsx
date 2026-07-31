import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "STUDENT"
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await register(form);

      navigate("/login", {
        state: {
          message:
            user.status === "PENDING"
              ? "Registration completed. Wait for administrator approval."
              : "Registration completed. You can now log in."
        }
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg auth-card">
              <div className="card-body p-4 p-lg-5">
                <h1 className="h3 fw-bold">Create account</h1>
                <p className="text-secondary">
                  Students receive immediate access. Instructors
                  require administrator approval.
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
                        value={form.phone}
                        onChange={update}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Password
                      </label>
                      <input
                        name="password"
                        type="password"
                        className="form-control"
                        minLength="8"
                        required
                        value={form.password}
                        onChange={update}
                      />
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
                    className="btn btn-primary w-100 mt-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating account..."
                      : "Create Account"}
                  </button>
                </form>

                <p className="text-center small mt-4 mb-0">
                  Already registered?{" "}
                  <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
