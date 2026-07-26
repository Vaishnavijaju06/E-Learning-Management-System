import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // if (isAuthenticated) {
  //   return <Navigate to="/student/dashboard" replace />;
  // }

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

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
      validationErrors.firstName =
        "First name must contain at least 2 characters.";
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      validationErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      validationErrors.phone =
        "Enter a valid 10-digit Indian phone number.";
    }

    if (!formData.password) {
      validationErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      validationErrors.password =
        "Password must contain at least 8 characters.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(
        formData.password
      )
    ) {
      validationErrors.password =
        "Use uppercase, lowercase, number and special character.";
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      validationErrors.confirmPassword =
        "Passwords do not match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success(
        "Registration successful. Please log in."
      );

      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: formData.email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "Registration failed. Please try again.",
      });

      toast.error(
        error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7 col-xl-6">
          <section className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="badge text-bg-primary mb-3">
                  Join SkillForge
                </span>

                <h1 className="fw-bold h2">
                  Create your account
                </h1>

                <p className="text-secondary mb-0">
                  Start learning and building new skills today.
                </p>
              </div>

              {errors.submit && (
                <div className="alert alert-danger">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="firstName"
                      className="form-label"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />

                    <div className="invalid-feedback">
                      {errors.firstName}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="lastName"
                      className="form-label"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />

                    <div className="invalid-feedback">
                      {errors.lastName}
                    </div>
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="email"
                      className="form-label"
                    >
                      Email address
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
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="phone"
                      className="form-label"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength="10"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                    />

                    <div className="invalid-feedback">
                      {errors.phone}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="password"
                      className="form-label"
                    >
                      Password
                    </label>

                    <div className="input-group">
                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword ? "text" : "password"
                        }
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
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
                        {errors.password}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label"
                    >
                      Confirm password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                    />

                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  </div>
                </div>

                <p className="small text-secondary mt-3">
                  Password must contain at least 8 characters,
                  including uppercase, lowercase, number and a
                  special character.
                </p>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-3 mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Student Account
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-secondary mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="fw-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;