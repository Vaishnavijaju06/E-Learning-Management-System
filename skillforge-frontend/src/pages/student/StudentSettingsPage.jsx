import { useState } from "react";
import { toast } from "react-toastify";

import {
  changeStudentPassword,
  getStudentSettings,
  updateStudentSettings,
} from "../../services/settingsService";

function StudentSettingsPage() {
  const [settings, setSettings] = useState(
    () => getStudentSettings()
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const handleSettingChange = (event) => {
    const { name, value, checked, type } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSettingsSubmit = (event) => {
    event.preventDefault();

    updateStudentSettings(settings);
    toast.success("Account settings saved successfully");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    try {
      changeStudentPassword(passwordForm);

      toast.success("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogoutOtherDevices = () => {
    toast.success("Logged out from all other devices");
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Account Settings</h1>

        <p className="text-secondary mb-0">
          Manage notifications, privacy, password and account security.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-xl-7">
          <form onSubmit={handleSettingsSubmit}>
            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-1">
                  Notification Preferences
                </h4>

                <p className="text-secondary mb-4">
                  Choose which notifications you want to receive.
                </p>

                <SettingSwitch
                  name="emailNotifications"
                  label="Email notifications"
                  description="Receive important account notifications by email."
                  checked={settings.emailNotifications}
                  onChange={handleSettingChange}
                />

                <SettingSwitch
                  name="courseUpdates"
                  label="Course updates"
                  description="Receive announcements and lesson updates."
                  checked={settings.courseUpdates}
                  onChange={handleSettingChange}
                />

                <SettingSwitch
                  name="assignmentReminders"
                  label="Assignment reminders"
                  description="Receive reminders about upcoming deadlines."
                  checked={settings.assignmentReminders}
                  onChange={handleSettingChange}
                />

                <SettingSwitch
                  name="certificateNotifications"
                  label="Certificate notifications"
                  description="Get notified when a certificate is issued."
                  checked={settings.certificateNotifications}
                  onChange={handleSettingChange}
                />

                <SettingSwitch
                  name="promotionalEmails"
                  label="Promotional emails"
                  description="Receive offers and course recommendations."
                  checked={settings.promotionalEmails}
                  onChange={handleSettingChange}
                  last
                />
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-1">
                  Privacy and Preferences
                </h4>

                <p className="text-secondary mb-4">
                  Control your profile visibility and application preferences.
                </p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="profileVisibility"
                      className="form-label"
                    >
                      Profile visibility
                    </label>

                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      className="form-select"
                      value={settings.profileVisibility}
                      onChange={handleSettingChange}
                    >
                      <option value="public">Public</option>
                      <option value="students">
                        SkillForge students only
                      </option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="language"
                      className="form-label"
                    >
                      Language
                    </label>

                    <select
                      id="language"
                      name="language"
                      className="form-select"
                      value={settings.language}
                      onChange={handleSettingChange}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="theme" className="form-label">
                      Theme preference
                    </label>

                    <select
                      id="theme"
                      name="theme"
                      className="form-select"
                      value={settings.theme}
                      onChange={handleSettingChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System default</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        id="showCompletedCourses"
                        type="checkbox"
                        name="showCompletedCourses"
                        className="form-check-input"
                        checked={settings.showCompletedCourses}
                        onChange={handleSettingChange}
                      />

                      <label
                        htmlFor="showCompletedCourses"
                        className="form-check-label"
                      >
                        Show completed courses on my public profile
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Save Settings
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="col-xl-5">
          <section className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-1">Change Password</h4>

              <p className="text-secondary mb-4">
                Use a strong and unique password.
              </p>

              <form onSubmit={handlePasswordSubmit}>
                {[
                  ["currentPassword", "Current password"],
                  ["newPassword", "New password"],
                  ["confirmPassword", "Confirm new password"],
                ].map(([name, label]) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">
                      {label}
                    </label>

                    <input
                      id={name}
                      type={showPasswords ? "text" : "password"}
                      name={name}
                      className="form-control"
                      value={passwordForm[name]}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                ))}

                <div className="form-check mb-3">
                  <input
                    id="showPasswords"
                    type="checkbox"
                    className="form-check-input"
                    checked={showPasswords}
                    onChange={(event) =>
                      setShowPasswords(event.target.checked)
                    }
                  />

                  <label
                    htmlFor="showPasswords"
                    className="form-check-label"
                  >
                    Show passwords
                  </label>
                </div>

                <div className="alert alert-light border small">
                  Password must contain at least eight characters,
                  including uppercase, lowercase, number and special
                  character.
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100"
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Change Password
                </button>
              </form>
            </div>
          </section>

          <section className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-1">Active Sessions</h4>

              <p className="text-secondary">
                Review devices currently signed into your account.
              </p>

              <div className="active-session-card">
                <div className="active-session-icon">
                  <i className="bi bi-laptop"></i>
                </div>

                <div>
                  <strong>Windows · Chrome</strong>
                  <span>Pune, India · Current session</span>
                </div>

                <span className="badge text-bg-success">
                  Active
                </span>
              </div>

              <button
                type="button"
                className="btn btn-outline-danger w-100 mt-4"
                onClick={handleLogoutOtherDevices}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Log Out Other Devices
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SettingSwitch({
  name,
  label,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`settings-switch-row ${
        last ? "border-0 pb-0 mb-0" : ""
      }`}
    >
      <div>
        <label htmlFor={name} className="fw-semibold">
          {label}
        </label>

        <p className="text-secondary small mb-0">
          {description}
        </p>
      </div>

      <div className="form-check form-switch mb-0">
        <input
          id={name}
          type="checkbox"
          name={name}
          className="form-check-input"
          checked={checked}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default StudentSettingsPage;