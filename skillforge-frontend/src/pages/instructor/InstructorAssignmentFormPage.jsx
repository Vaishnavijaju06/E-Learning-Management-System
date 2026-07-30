import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import instructorAssignmentService from "../../services/instructorAssignmentService";
import instructorCourseService from "../../services/instructorCourseService";

const emptyForm = {
  courseId: "",
  title: "",
  description: "",
  dueDate: "",
  totalMarks: 100,
  resourceUrl: "",
  allowedFileTypes: "PDF, DOCX, ZIP",
  status: "DRAFT",
};

function InstructorAssignmentFormPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(assignmentId);
  const courses = instructorCourseService.getCourses();

  const [loadError, setLoadError] = useState("");
  const [formData, setFormData] = useState(() => {
    if (!isEditing) return emptyForm;
    try {
      return instructorAssignmentService.getAssignmentById(assignmentId);
    } catch (error) {
      setLoadError(error.message);
      return emptyForm;
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "", submit: "" }));
  };

  const validate = (status) => {
    const nextErrors = {};
    if (!formData.courseId) nextErrors.courseId = "Select a course.";
    if (formData.title.trim().length < 5) {
      nextErrors.title = "Title must contain at least five characters.";
    }
    if (formData.description.trim().length < 20) {
      nextErrors.description =
        "Instructions must contain at least twenty characters.";
    }
    if (!formData.dueDate) {
      nextErrors.dueDate = "Select a submission deadline.";
    } else if (
      status === "PUBLISHED" &&
      new Date(formData.dueDate).getTime() <= Date.now()
    ) {
      nextErrors.dueDate = "A published assignment needs a future deadline.";
    }
    const marks = Number(formData.totalMarks);
    if (!Number.isInteger(marks) || marks < 1 || marks > 1000) {
      nextErrors.totalMarks = "Marks must be a whole number from 1 to 1000.";
    }
    if (
      formData.resourceUrl &&
      !/^https?:\/\/\S+$/i.test(formData.resourceUrl.trim())
    ) {
      nextErrors.resourceUrl = "Enter a valid http or https URL.";
    }
    if (!formData.allowedFileTypes.trim()) {
      nextErrors.allowedFileTypes = "Enter at least one allowed file type.";
    }
    return nextErrors;
  };

  const save = async (status) => {
    const validationErrors = validate(status);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      instructorAssignmentService.saveAssignment({
        ...formData,
        id: isEditing ? Number(assignmentId) : undefined,
        title: formData.title.trim(),
        description: formData.description.trim(),
        allowedFileTypes: formData.allowedFileTypes.trim(),
        status,
      });
      toast.success(
        `Assignment ${status === "PUBLISHED" ? "published" : "saved as draft"}.`
      );
      navigate("/instructor/assignments");
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">{loadError}</div>
        <Link to="/instructor/assignments" className="btn btn-primary">
          Return to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link
          to="/instructor/assignments"
          className="btn btn-light border"
          aria-label="Back to assignments"
        >
          <i className="bi bi-arrow-left"></i>
        </Link>
        <div>
          <h1 className="h3 fw-bold mb-1">
            {isEditing ? "Edit Assignment" : "Create Assignment"}
          </h1>
          <p className="text-secondary mb-0">
            Add clear instructions, marks and a submission deadline.
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}
          <div className="row g-4">
            <div className="col-lg-7">
              <label className="form-label" htmlFor="title">
                Assignment title
              </label>
              <input
                id="title"
                name="title"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Build a REST API"
              />
              <div className="invalid-feedback">{errors.title}</div>
            </div>
            <div className="col-lg-5">
              <label className="form-label" htmlFor="courseId">
                Course
              </label>
              <select
                id="courseId"
                name="courseId"
                className={`form-select ${
                  errors.courseId ? "is-invalid" : ""
                }`}
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.courseId}</div>
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="description">
                Instructions
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the task, expected output and evaluation criteria..."
              ></textarea>
              <div className="invalid-feedback">{errors.description}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="dueDate">
                Submission deadline
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                className={`form-control ${
                  errors.dueDate ? "is-invalid" : ""
                }`}
                value={formData.dueDate}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.dueDate}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="totalMarks">
                Total marks
              </label>
              <input
                id="totalMarks"
                name="totalMarks"
                type="number"
                min="1"
                max="1000"
                className={`form-control ${
                  errors.totalMarks ? "is-invalid" : ""
                }`}
                value={formData.totalMarks}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.totalMarks}</div>
            </div>

            <div className="col-md-7">
              <label className="form-label" htmlFor="resourceUrl">
                Resource URL <span className="text-secondary">(optional)</span>
              </label>
              <input
                id="resourceUrl"
                name="resourceUrl"
                type="url"
                className={`form-control ${
                  errors.resourceUrl ? "is-invalid" : ""
                }`}
                value={formData.resourceUrl}
                onChange={handleChange}
                placeholder="https://example.com/assignment-guide"
              />
              <div className="invalid-feedback">{errors.resourceUrl}</div>
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="allowedFileTypes">
                Allowed file types
              </label>
              <input
                id="allowedFileTypes"
                name="allowedFileTypes"
                className={`form-control ${
                  errors.allowedFileTypes ? "is-invalid" : ""
                }`}
                value={formData.allowedFileTypes}
                onChange={handleChange}
                placeholder="PDF, DOCX, ZIP"
              />
              <div className="invalid-feedback">{errors.allowedFileTypes}</div>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-end gap-2 border-top mt-4 pt-4">
            <Link to="/instructor/assignments" className="btn btn-light border">
              Cancel
            </Link>
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={isSubmitting}
              onClick={() => save("DRAFT")}
            >
              <i className="bi bi-save me-2"></i>Save as Draft
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => save("PUBLISHED")}
            >
              <i className="bi bi-send me-2"></i>Save and Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorAssignmentFormPage;
