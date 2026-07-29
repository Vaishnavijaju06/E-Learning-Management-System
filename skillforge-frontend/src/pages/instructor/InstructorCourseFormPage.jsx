import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import instructorCourseService from "../../services/instructorCourseService";

const categories = [
  "Web Development",
  "Java Development",
  "Software Architecture",
  "Development Tools",
  "Database",
  "Cloud & DevOps",
];

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  level: "",
  language: "English",
  price: "",
  icon: "bi-journal-richtext",
  color: "primary",
};

function InstructorCourseFormPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditMode = Boolean(courseId);

  const [formData, setFormData] = useState(initialForm);
  const [existingStatus, setExistingStatus] = useState("DRAFT");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    try {
      const course = instructorCourseService.getCourseById(courseId);

      setFormData({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        description: course.description || "",
        category: course.category || "",
        level: course.level || "",
        language: course.language || "English",
        price: String(course.price ?? ""),
        icon: course.icon || "bi-journal-richtext",
        color: course.color || "primary",
      });
      setExistingStatus(course.status);
    } catch (error) {
      setLoadError(error.message);
    }
  }, [courseId, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const price = Number(formData.price);

    if (formData.title.trim().length < 5) {
      validationErrors.title =
        "Course title must contain at least 5 characters.";
    }

    if (
      formData.shortDescription.trim().length < 20 ||
      formData.shortDescription.trim().length > 150
    ) {
      validationErrors.shortDescription =
        "Short description must contain 20 to 150 characters.";
    }

    if (formData.description.trim().length < 50) {
      validationErrors.description =
        "Course description must contain at least 50 characters.";
    }

    if (!formData.category) {
      validationErrors.category = "Select a category.";
    }

    if (!formData.level) {
      validationErrors.level = "Select a course level.";
    }

    if (!formData.language.trim()) {
      validationErrors.language = "Language is required.";
    }

    if (formData.price === "" || Number.isNaN(price) || price < 0) {
      validationErrors.price = "Enter a valid price of ₹0 or more.";
    } else if (price > 100000) {
      validationErrors.price = "Price cannot exceed ₹1,00,000.";
    }

    return validationErrors;
  };

  const handleSubmit = async (status) => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setIsSaving(true);

      const courseData = {
        ...formData,
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        language: formData.language.trim(),
      };

      if (isEditMode) {
        instructorCourseService.updateCourse(
          courseId,
          courseData,
          status
        );
      } else {
        instructorCourseService.createCourse(courseData, status);
      }

      toast.success(
        status === "PUBLISHED"
          ? "Course saved and published successfully."
          : "Course saved as draft."
      );
      navigate("/instructor/courses");
    } catch (error) {
      toast.error(error.message || "Unable to save the course.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="container-fluid py-5 px-3 px-md-4">
        <div className="card border-0 shadow-sm text-center">
          <div className="card-body py-5">
            <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
            <h1 className="h4 fw-bold mt-3">{loadError}</h1>
            <Link to="/instructor/courses" className="btn btn-primary mt-3">
              Return to My Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <Link
            to="/instructor/courses"
            className="small text-decoration-none"
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to courses
          </Link>
          <h1 className="h2 fw-bold mt-2 mb-1">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-secondary mb-0">
            Add clear information that helps students understand your course.
          </p>
        </div>

        {isEditMode && (
          <div>
            <span
              className={`badge ${
                existingStatus === "PUBLISHED"
                  ? "text-bg-success"
                  : "text-bg-warning"
              }`}
            >
              Currently {existingStatus.toLowerCase()}
            </span>
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(existingStatus);
        }}
        noValidate
      >
        <div className="row g-4">
          <div className="col-xl-8">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-4">Basic information</h2>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Course title
                  </label>
                  <input
                    id="title"
                    name="title"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    value={formData.title}
                    onChange={handleChange}
                    maxLength="100"
                    placeholder="Example: Complete Spring Boot Development"
                  />
                  <div className="invalid-feedback">{errors.title}</div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label
                      htmlFor="shortDescription"
                      className="form-label"
                    >
                      Short description
                    </label>
                    <small className="text-secondary">
                      {formData.shortDescription.length}/150
                    </small>
                  </div>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    rows="2"
                    maxLength="150"
                    className={`form-control ${
                      errors.shortDescription ? "is-invalid" : ""
                    }`}
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Give students a quick overview of the course."
                  ></textarea>
                  <div className="invalid-feedback">
                    {errors.shortDescription}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Full description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="7"
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Explain what students will learn and any prerequisites."
                  ></textarea>
                  <div className="invalid-feedback">
                    {errors.description}
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-4">Course details</h2>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className={`form-select ${
                        errors.category ? "is-invalid" : ""
                      }`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      {errors.category}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="level" className="form-label">
                      Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      className={`form-select ${
                        errors.level ? "is-invalid" : ""
                      }`}
                      value={formData.level}
                      onChange={handleChange}
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <div className="invalid-feedback">{errors.level}</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="language" className="form-label">
                      Language
                    </label>
                    <input
                      id="language"
                      name="language"
                      className={`form-control ${
                        errors.language ? "is-invalid" : ""
                      }`}
                      value={formData.language}
                      onChange={handleChange}
                      placeholder="English"
                    />
                    <div className="invalid-feedback">
                      {errors.language}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">
                      Price (₹)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      max="100000"
                      className={`form-control ${
                        errors.price ? "is-invalid" : ""
                      }`}
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1999"
                    />
                    <div className="invalid-feedback">{errors.price}</div>
                    <div className="form-text">
                      Enter 0 to offer this course for free.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="col-xl-4">
            <section className="card border-0 shadow-sm instructor-form-actions">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold">Ready to save?</h2>
                <p className="small text-secondary">
                  Draft courses remain private. Published courses become
                  available in the catalogue.
                </p>

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-primary-custom py-2"
                    disabled={isSaving}
                    onClick={() => handleSubmit("PUBLISHED")}
                  >
                    <i className="bi bi-send-check me-2"></i>
                    {isSaving ? "Saving..." : "Save & Publish"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2"
                    disabled={isSaving}
                    onClick={() => handleSubmit("DRAFT")}
                  >
                    <i className="bi bi-file-earmark me-2"></i>
                    Save as Draft
                  </button>

                  <Link
                    to="/instructor/courses"
                    className="btn btn-link text-secondary"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InstructorCourseFormPage;
