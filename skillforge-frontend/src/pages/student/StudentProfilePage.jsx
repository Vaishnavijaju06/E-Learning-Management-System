import { useState } from "react";
import { toast } from "react-toastify";

import {
  getStudentProfile,
  updateStudentProfile,
} from "../../services/profileService";

function StudentProfilePage() {
  const [profile, setProfile] = useState(
    () => getStudentProfile()
  );

  const [newSkill, setNewSkill] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleEducationChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      education: {
        ...currentProfile.education,
        [name]: value,
      },
    }));
  };

  const handleSocialLinkChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      socialLinks: {
        ...currentProfile.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleAddSkill = () => {
    const cleanedSkill = newSkill.trim();

    if (!cleanedSkill) {
      return;
    }

    const skillAlreadyExists = profile.skills.some(
      (skill) =>
        skill.toLowerCase() === cleanedSkill.toLowerCase()
    );

    if (skillAlreadyExists) {
      toast.info("This skill is already added");
      return;
    }

    setProfile((currentProfile) => ({
      ...currentProfile,
      skills: [...currentProfile.skills, cleanedSkill],
    }));

    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      skills: currentProfile.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateStudentProfile(profile);
    toast.success("Profile updated successfully");
  };

  const initials =
    `${profile.firstName?.[0] || ""}${
      profile.lastName?.[0] || ""
    }`.toUpperCase();

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">My Profile</h1>

        <p className="text-secondary mb-0">
          Manage your personal and professional information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-xl-4">
            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 text-center">
                <div className="student-profile-avatar mx-auto">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <h4 className="fw-bold mt-3 mb-1">
                  {profile.firstName} {profile.lastName}
                </h4>

                <p className="text-secondary">
                  {profile.headline}
                </p>

                <label
                  htmlFor="profilePicture"
                  className="form-label text-start w-100"
                >
                  Profile-picture URL
                </label>

                <input
                  id="profilePicture"
                  type="url"
                  name="profilePicture"
                  className="form-control"
                  value={profile.profilePicture}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </section>
          </div>

          <div className="col-xl-8">
            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">
                  Personal Information
                </h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      First name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={profile.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Last name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={profile.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>

                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Date of birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender</label>

                    <select
                      name="gender"
                      className="form-select"
                      value={profile.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Professional headline
                    </label>

                    <input
                      type="text"
                      name="headline"
                      className="form-control"
                      value={profile.headline}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Bio</label>

                    <textarea
                      name="bio"
                      className="form-control"
                      rows="4"
                      maxLength="500"
                      value={profile.bio}
                      onChange={handleChange}
                    />

                    <small className="text-secondary">
                      {profile.bio.length}/500 characters
                    </small>
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">
                  Location and Education
                </h4>

                <div className="row g-3">
                  {["city", "state", "country"].map((field) => (
                    <div className="col-md-4" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>

                      <input
                        type="text"
                        name={field}
                        className="form-control"
                        value={profile[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}

                  <div className="col-md-5">
                    <label className="form-label">
                      Institute
                    </label>

                    <input
                      type="text"
                      name="institute"
                      className="form-control"
                      value={profile.education.institute}
                      onChange={handleEducationChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Course</label>

                    <input
                      type="text"
                      name="course"
                      className="form-control"
                      value={profile.education.course}
                      onChange={handleEducationChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Completion year
                    </label>

                    <input
                      type="number"
                      name="completionYear"
                      className="form-control"
                      min="1950"
                      max="2100"
                      value={profile.education.completionYear}
                      onChange={handleEducationChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Skills</h4>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={newSkill}
                    onChange={(event) =>
                      setNewSkill(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Enter a skill"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddSkill}
                  >
                    Add
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      className="badge rounded-pill text-bg-primary p-2"
                      key={skill}
                    >
                      {skill}

                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        aria-label={`Remove ${skill}`}
                        onClick={() => handleRemoveSkill(skill)}
                      ></button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Social Links</h4>

                <div className="row g-3">
                  {["github", "linkedin", "portfolio"].map(
                    (platform) => (
                      <div className="col-md-4" key={platform}>
                        <label className="form-label text-capitalize">
                          {platform}
                        </label>

                        <input
                          type="url"
                          name={platform}
                          className="form-control"
                          value={profile.socialLinks[platform]}
                          onChange={handleSocialLinkChange}
                          placeholder={`https://${platform}.com/...`}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Save Profile
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </main>
  );
}

export default StudentProfilePage;