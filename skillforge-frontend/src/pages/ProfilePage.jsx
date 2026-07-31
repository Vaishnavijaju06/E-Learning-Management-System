import { useEffect, useState } from "react";

import getErrorMessage from "../api/getErrorMessage";
import { userApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    userApi
      .profile()
      .then((response) => setForm(response.data))
      .catch((requestError) =>
        setError(getErrorMessage(requestError))
      );
  }, []);

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
      const response = await userApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || "",
        bio: form.bio || "",
        profilePictureUrl: form.profilePictureUrl || ""
      });
      setForm(response.data);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (!form && !error) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="fw-bold mb-4">My Profile</h1>
          <AlertMessage>{error}</AlertMessage>
          <AlertMessage type="success">{message}</AlertMessage>

          {form && (
            <form
              className="card border-0 shadow-sm"
              onSubmit={save}
            >
              <div className="card-body p-4">
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

                <button className="btn btn-primary mt-4">
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
