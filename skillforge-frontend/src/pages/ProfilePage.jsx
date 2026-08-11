import { useEffect, useState } from "react";

import getErrorMessage from "../api/getErrorMessage";
import { userApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusModal from "../components/StatusModal";
import { useToast } from "../context/ToastContext";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: ""
};

export default function ProfilePage() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  const [passwordForm, setPasswordForm] = useState(
    emptyPasswordForm
  );
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] =
    useState(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [passwordSuccessModal, setPasswordSuccessModal] =
    useState(null);

  useEffect(() => {
    userApi
      .profile()
      .then((response) => setForm(response.data))
      .catch((requestError) => {
        const errorMessage = getErrorMessage(requestError);
        setError(errorMessage);
        toast.error(errorMessage);
      });
  }, [toast]);

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setWorking(true);
      const response = await userApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || "",
        bio: form.bio || "",
        profilePictureUrl: form.profilePictureUrl || ""
      });
      setForm(response.data);
      const successMessage =
        "Profile updated successfully.";
      setMessage(successMessage);
      toast.success(successMessage);
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setWorking(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setPasswordError("");

    if (
      passwordForm.newPassword
        !== passwordForm.confirmNewPassword
    ) {
      const errorMessage = "New passwords do not match.";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      setChangingPassword(true);
      const response = await userApi.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordForm(emptyPasswordForm);
      setPasswordSuccessModal(
        response.data?.message
          || "Your password has been updated."
      );
    } catch (requestError) {
      const errorMessage = getErrorMessage(
        requestError,
        "Unable to change your password"
      );
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  }

  if (!form && !error) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <span className="section-eyebrow">Account settings</span>
        <h1>My Profile</h1>
        <p>
          Keep your personal information and professional profile
          up to date.
        </p>
      </div>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage type="success">{message}</AlertMessage>

      {form && (
        <div className="row g-4">
          <div className="col-lg-4">
            <aside className="card border-0 h-100">
              <div className="card-body p-4 text-center">
                {form.profilePictureUrl ? (
                  <img
                    src={form.profilePictureUrl}
                    alt={`${form.firstName} ${form.lastName}`}
                    className="profile-avatar-image mb-3"
                  />
                ) : (
                  <div className="profile-avatar-placeholder mx-auto mb-3">
                    {form.firstName?.charAt(0)?.toUpperCase()}
                    {form.lastName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <h2 className="h5 fw-bold mb-1">
                  {form.firstName} {form.lastName}
                </h2>
                <p className="text-secondary small mb-3">
                  {form.email}
                </p>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                  {form.role}
                </span>

                {form.bio && (
                  <p className="small text-secondary mt-4 mb-0">
                    {form.bio}
                  </p>
                )}
              </div>
            </aside>
          </div>

          <div className="col-lg-8">
            <form className="card border-0" onSubmit={save}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="feature-icon-box mb-0">
                    <i className="bi bi-person-gear"></i>
                  </div>
                  <div>
                    <h2 className="h5 fw-bold mb-1">
                      Personal information
                    </h2>
                    <small className="text-secondary">
                      Update the information visible on your account.
                    </small>
                  </div>
                </div>

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
                      className="form-control"
                      value={form.email}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      name="phone"
                      className="form-control"
                      value={form.phone || ""}
                      onChange={update}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Profile picture URL
                    </label>
                    <input
                      name="profilePictureUrl"
                      className="form-control"
                      value={form.profilePictureUrl || ""}
                      onChange={update}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      className="form-control"
                      rows="4"
                      value={form.bio || ""}
                      onChange={update}
                    ></textarea>
                  </div>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  disabled={working}
                >
                  {working ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>

            <form
              className="card border-0 mt-4"
              onSubmit={changePassword}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="feature-icon-box mb-0">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <div>
                    <h2 className="h5 fw-bold mb-1">
                      Change password
                    </h2>
                    <small className="text-secondary">
                      Use a strong password you don't use
                      anywhere else.
                    </small>
                  </div>
                </div>

                <AlertMessage>{passwordError}</AlertMessage>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">
                      Current password
                    </label>
                    <div className="position-relative">
                      <input
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control pe-5"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword:
                              event.target.value
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn password-toggle-btn position-absolute top-50 end-0 translate-middle-y"
                        onClick={() =>
                          setShowCurrentPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showCurrentPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        tabIndex={-1}
                      >
                        <i
                          className={`bi ${
                            showCurrentPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      New password
                    </label>
                    <div className="position-relative">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control pe-5"
                        placeholder="Minimum 8 characters"
                        minLength="8"
                        required
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: event.target.value
                          })
                        }
                      />
                      <button
                        type="button"
                        className="btn password-toggle-btn position-absolute top-50 end-0 translate-middle-y"
                        onClick={() =>
                          setShowNewPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        tabIndex={-1}
                      >
                        <i
                          className={`bi ${
                            showNewPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Confirm new password
                    </label>
                    <div className="position-relative">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        className={`form-control pe-5${
                          passwordForm.confirmNewPassword
                            && passwordForm.newPassword
                              !== passwordForm.confirmNewPassword
                            ? " is-invalid"
                            : ""
                        }`}
                        minLength="8"
                        required
                        value={
                          passwordForm.confirmNewPassword
                        }
                        onChange={(event) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmNewPassword:
                              event.target.value
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
                      {passwordForm.confirmNewPassword
                        && passwordForm.newPassword
                          !== passwordForm.confirmNewPassword && (
                          <div className="invalid-feedback d-block">
                            Passwords do not match.
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary mt-4"
                  disabled={
                    changingPassword
                    || (passwordForm.confirmNewPassword
                      && passwordForm.newPassword
                        !== passwordForm.confirmNewPassword)
                  }
                >
                  {changingPassword ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock me-2"></i>
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordSuccessModal && (
        <StatusModal
          type="success"
          title="Password updated"
          message={passwordSuccessModal}
          confirmLabel="OK"
          onClose={() => setPasswordSuccessModal(null)}
        />
      )}
    </div>
  );
}