import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import curriculumService from "../../services/curriculumService";
import instructorCourseService from "../../services/instructorCourseService";

const emptyLesson = {
  title: "",
  type: "VIDEO",
  duration: "",
  contentUrl: "",
  preview: false,
  published: false,
};

function InstructorCurriculumPage() {
  const { courseId } = useParams();
  const [course] = useState(() => {
    try {
      return instructorCourseService.getCourseById(courseId);
    } catch {
      return null;
    }
  });
  const [modules, setModules] = useState(() =>
    course ? curriculumService.getCurriculum(courseId) : []
  );
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [errors, setErrors] = useState({});

  const summary = useMemo(() => {
    const lessons = modules.flatMap((module) => module.lessons);
    return {
      modules: modules.length,
      lessons: lessons.length,
      published: lessons.filter((lesson) => lesson.published).length,
      minutes: lessons.reduce((total, lesson) => total + lesson.duration, 0),
    };
  }, [modules]);

  if (!course) {
    return (
      <div className="container-fluid py-5 text-center">
        <i className="bi bi-exclamation-circle fs-1 text-warning"></i>
        <h1 className="h3 mt-3">Course not found</h1>
        <Link to="/instructor/courses" className="btn btn-primary mt-2">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const addModule = (event) => {
    event.preventDefault();
    if (moduleTitle.trim().length < 3) {
      toast.error("Module title must contain at least 3 characters.");
      return;
    }
    setModules(curriculumService.addModule(courseId, moduleTitle));
    setModuleTitle("");
    toast.success("Module added.");
  };

  const renameModule = async (module) => {
    const result = await Swal.fire({
      title: "Rename module",
      input: "text",
      inputValue: module.title,
      showCancelButton: true,
      inputValidator: (value) =>
        value.trim().length < 3 ? "Enter at least 3 characters." : undefined,
    });
    if (result.isConfirmed) {
      setModules(
        curriculumService.updateModule(courseId, module.id, result.value)
      );
      toast.success("Module renamed.");
    }
  };

  const deleteModule = async (module) => {
    const result = await Swal.fire({
      title: "Delete module?",
      text: `"${module.title}" and all its lessons will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete module",
      confirmButtonColor: "#dc3545",
    });
    if (result.isConfirmed) {
      setModules(curriculumService.deleteModule(courseId, module.id));
      toast.success("Module deleted.");
    }
  };

  const openLessonForm = (moduleId, lesson = null) => {
    setActiveModuleId(moduleId);
    setEditingLessonId(lesson?.id || null);
    setLessonForm(lesson ? { ...lesson } : emptyLesson);
    setErrors({});
  };

  const closeLessonForm = () => {
    setActiveModuleId(null);
    setEditingLessonId(null);
    setLessonForm(emptyLesson);
    setErrors({});
  };

  const saveLesson = (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (lessonForm.title.trim().length < 3) {
      validationErrors.title = "Enter at least 3 characters.";
    }
    if (!lessonForm.duration || Number(lessonForm.duration) < 1) {
      validationErrors.duration = "Duration must be at least 1 minute.";
    }
    if (!lessonForm.contentUrl.trim()) {
      validationErrors.contentUrl = "Content URL is required.";
    } else {
      try {
        new URL(lessonForm.contentUrl);
      } catch {
        validationErrors.contentUrl = "Enter a complete valid URL.";
      }
    }
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setModules(
      curriculumService.saveLesson(
        courseId,
        activeModuleId,
        lessonForm,
        editingLessonId
      )
    );
    toast.success(editingLessonId ? "Lesson updated." : "Lesson added.");
    closeLessonForm();
  };

  const deleteLesson = async (moduleId, lesson) => {
    const result = await Swal.fire({
      title: "Delete lesson?",
      text: `"${lesson.title}" will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Delete lesson",
    });
    if (result.isConfirmed) {
      setModules(
        curriculumService.deleteLesson(courseId, moduleId, lesson.id)
      );
      toast.success("Lesson deleted.");
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <Link to="/instructor/courses" className="small text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i>My Courses
          </Link>
          <p className="text-primary fw-semibold mt-3 mb-1">CURRICULUM BUILDER</p>
          <h1 className="h2 fw-bold mb-1">{course.title}</h1>
          <p className="text-secondary mb-0">
            Organize modules and lessons in the order students will learn them.
          </p>
        </div>
        <span className={`badge align-self-lg-start fs-6 ${
          course.status === "PUBLISHED" ? "text-bg-success" : "text-bg-warning"
        }`}>
          {course.status === "PUBLISHED" ? "Published Course" : "Draft Course"}
        </span>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Modules", summary.modules, "bi-collection"],
          ["Lessons", summary.lessons, "bi-play-btn"],
          ["Published", summary.published, "bi-check-circle"],
          ["Duration", `${summary.minutes} min`, "bi-clock"],
        ].map(([label, value, icon]) => (
          <div className="col-6 col-xl-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className={`bi ${icon} text-primary me-2`}></i>
                <span className="text-secondary small">{label}</span>
                <h2 className="h4 fw-bold mt-2 mb-0">{value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="card border-0 shadow-sm mb-4" onSubmit={addModule}>
        <div className="card-body d-flex flex-column flex-sm-row gap-2">
          <input
            className="form-control"
            value={moduleTitle}
            onChange={(event) => setModuleTitle(event.target.value)}
            placeholder="New module title, e.g. React Fundamentals"
          />
          <button className="btn btn-primary-custom flex-shrink-0" type="submit">
            <i className="bi bi-plus-lg me-2"></i>Add Module
          </button>
        </div>
      </form>

      {modules.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <i className="bi bi-collection fs-1 text-secondary"></i>
          <h2 className="h5 mt-3">Your curriculum is empty</h2>
          <p className="text-secondary mb-0">Add the first module to begin.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {modules.map((module, moduleIndex) => (
            <section className="card border-0 shadow-sm" key={module.id}>
              <div className="card-header bg-white p-3 d-flex flex-wrap align-items-center gap-2">
                <span className="badge text-bg-primary">Module {moduleIndex + 1}</span>
                <h2 className="h5 fw-bold mb-0 me-auto">{module.title}</h2>
                <button className="btn btn-sm btn-light" disabled={moduleIndex === 0}
                  onClick={() => setModules(curriculumService.moveModule(courseId, module.id, -1))}>
                  <i className="bi bi-arrow-up"></i>
                </button>
                <button className="btn btn-sm btn-light" disabled={moduleIndex === modules.length - 1}
                  onClick={() => setModules(curriculumService.moveModule(courseId, module.id, 1))}>
                  <i className="bi bi-arrow-down"></i>
                </button>
                <button className="btn btn-sm btn-outline-primary" onClick={() => renameModule(module)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteModule(module)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="card-body p-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div className="curriculum-lesson" key={lesson.id}>
                    <span className="curriculum-lesson-number">{lessonIndex + 1}</span>
                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <h3 className="h6 fw-bold mb-0">{lesson.title}</h3>
                        {lesson.preview && <span className="badge text-bg-info">Preview</span>}
                        <span className={`badge ${lesson.published ? "text-bg-success" : "text-bg-secondary"}`}>
                          {lesson.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <small className="text-secondary">
                        {lesson.type} · {lesson.duration} minutes
                      </small>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light" disabled={lessonIndex === 0}
                        onClick={() => setModules(curriculumService.moveLesson(courseId, module.id, lesson.id, -1))}>
                        <i className="bi bi-arrow-up"></i>
                      </button>
                      <button className="btn btn-sm btn-light" disabled={lessonIndex === module.lessons.length - 1}
                        onClick={() => setModules(curriculumService.moveLesson(courseId, module.id, lesson.id, 1))}>
                        <i className="bi bi-arrow-down"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openLessonForm(module.id, lesson)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLesson(module.id, lesson)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn btn-outline-primary btn-sm mt-3" onClick={() => openLessonForm(module.id)}>
                  <i className="bi bi-plus-lg me-1"></i>Add Lesson
                </button>
              </div>
            </section>
          ))}
        </div>
      )}

      {activeModuleId && (
        <div className="curriculum-modal-backdrop">
          <div className="card border-0 shadow-lg curriculum-modal">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-3">
                <h2 className="h4 fw-bold mb-0">{editingLessonId ? "Edit Lesson" : "Add Lesson"}</h2>
                <button className="btn-close" onClick={closeLessonForm}></button>
              </div>
              <form onSubmit={saveLesson} noValidate>
                <div className="mb-3">
                  <label className="form-label">Lesson title</label>
                  <input className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    value={lessonForm.title}
                    onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })} />
                  <div className="invalid-feedback">{errors.title}</div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label">Content type</label>
                    <select className="form-select" value={lessonForm.type}
                      onChange={(event) => setLessonForm({ ...lessonForm, type: event.target.value })}>
                      <option value="VIDEO">Video</option>
                      <option value="ARTICLE">Article</option>
                      <option value="RESOURCE">Resource</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Duration (minutes)</label>
                    <input type="number" min="1" className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                      value={lessonForm.duration}
                      onChange={(event) => setLessonForm({ ...lessonForm, duration: event.target.value })} />
                    <div className="invalid-feedback">{errors.duration}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Content URL</label>
                  <input type="url" className={`form-control ${errors.contentUrl ? "is-invalid" : ""}`}
                    placeholder="https://example.com/content"
                    value={lessonForm.contentUrl}
                    onChange={(event) => setLessonForm({ ...lessonForm, contentUrl: event.target.value })} />
                  <div className="invalid-feedback">{errors.contentUrl}</div>
                </div>
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" id="previewLesson"
                    checked={lessonForm.preview}
                    onChange={(event) => setLessonForm({ ...lessonForm, preview: event.target.checked })} />
                  <label className="form-check-label" htmlFor="previewLesson">Allow free preview</label>
                </div>
                <div className="form-check form-switch mb-4">
                  <input className="form-check-input" type="checkbox" id="publishedLesson"
                    checked={lessonForm.published}
                    onChange={(event) => setLessonForm({ ...lessonForm, published: event.target.checked })} />
                  <label className="form-check-label" htmlFor="publishedLesson">Publish lesson</label>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light" onClick={closeLessonForm}>Cancel</button>
                  <button className="btn btn-primary-custom" type="submit">Save Lesson</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorCurriculumPage;
