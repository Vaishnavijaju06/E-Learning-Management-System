import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import instructorCourseService from "../../services/instructorCourseService";

function InstructorCoursesPage() {
  const [courses, setCourses] = useState(() =>
    instructorCourseService.getCourses()
  );
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = useMemo(
    () => [...new Set(courses.map((course) => course.category))].sort(),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.category.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || course.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, searchText, statusFilter, categoryFilter]);

  const counts = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((course) => course.status === "PUBLISHED")
        .length,
      drafts: courses.filter((course) => course.status === "DRAFT").length,
      students: courses.reduce((total, course) => total + course.students, 0),
    }),
    [courses]
  );

  const handleStatusChange = async (course) => {
    const nextStatus =
      course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const action = nextStatus === "PUBLISHED" ? "publish" : "unpublish";

    const result = await Swal.fire({
      title: `${action === "publish" ? "Publish" : "Unpublish"} course?`,
      text:
        action === "publish"
          ? "The course will become visible in the public catalogue."
          : "New students will no longer find this course in the catalogue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      confirmButtonColor: action === "publish" ? "#4f46e5" : "#dc3545",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const updatedCourses = instructorCourseService.updateStatus(
        course.id,
        nextStatus
      );
      setCourses(updatedCourses);
      toast.success(
        `Course ${nextStatus === "PUBLISHED" ? "published" : "unpublished"}.`
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (course) => {
    if (course.status !== "DRAFT") {
      toast.warning("Unpublish this course before deleting it.");
      return;
    }

    const result = await Swal.fire({
      title: "Delete draft course?",
      text: `"${course.title}" will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete draft",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setCourses(instructorCourseService.deleteDraft(course.id));
      toast.success("Draft course deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetFilters = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold mb-1">COURSE MANAGEMENT</p>
          <h1 className="h2 fw-bold mb-1">My Courses</h1>
          <p className="text-secondary mb-0">
            Create, update and publish courses from one place.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="btn btn-primary-custom px-4 py-2"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Create Course
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Courses", counts.total, "bi-journal-richtext", "primary"],
          ["Published", counts.published, "bi-broadcast", "success"],
          ["Drafts", counts.drafts, "bi-file-earmark", "warning"],
          ["Students", counts.students.toLocaleString("en-IN"), "bi-people", "info"],
        ].map(([label, value, icon, color]) => (
          <div className="col-6 col-xl-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`instructor-course-stat text-${color} bg-${color}-subtle`}>
                  <i className={`bi ${icon}`}></i>
                </span>
                <div>
                  <p className="small text-secondary mb-1">{label}</p>
                  <h2 className="h4 fw-bold mb-0">{value}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 mb-4">
            <div className="col-lg-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by course title or category"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter courses by status"
              >
                <option value="ALL">All statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            <div className="col-sm-6 col-lg-3">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter courses by category"
              >
                <option value="ALL">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-secondary"></i>
              <h2 className="h5 fw-bold mt-3">No courses found</h2>
              <p className="text-secondary">
                Change the search text or clear your filters.
              </p>
              <button className="btn btn-outline-primary" onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="instructor-course-list">
              {filteredCourses.map((course) => (
                <article className="instructor-course-row" key={course.id}>
                  <div className={`instructor-course-icon bg-${course.color}-subtle text-${course.color}`}>
                    <i className={`bi ${course.icon}`}></i>
                  </div>

                  <div className="instructor-course-details">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h2 className="h5 fw-bold mb-0">{course.title}</h2>
                      <span
                        className={`badge ${
                          course.status === "PUBLISHED"
                            ? "text-bg-success"
                            : "text-bg-warning"
                        }`}
                      >
                        {course.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="small text-secondary mb-2">
                      {course.category} · {course.level} · Updated {course.updatedAt}
                    </p>
                    <div className="d-flex flex-wrap gap-3 small">
                      <span><i className="bi bi-people me-1"></i>{course.students} students</span>
                      <span><i className="bi bi-play-btn me-1"></i>{course.lessons} lessons</span>
                      <span><i className="bi bi-star-fill text-warning me-1"></i>{course.rating || "New"}</span>
                      <strong>₹{course.price.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="instructor-course-actions">
                    {course.students > 0 && (
                      <Link
                        to={`/instructor/courses/${course.id}/students`}
                        className="btn btn-sm btn-outline-info"
                      >
                        <i className="bi bi-people me-1"></i>
                        Students
                      </Link>
                    )}
                    <Link
                      to={`/instructor/courses/${course.id}/curriculum`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <i className="bi bi-list-nested me-1"></i>
                      Curriculum
                    </Link>
                    <Link
                      to={`/instructor/courses/${course.id}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </Link>
                    <button
                      className={`btn btn-sm ${
                        course.status === "PUBLISHED"
                          ? "btn-outline-warning"
                          : "btn-outline-success"
                      }`}
                      onClick={() => handleStatusChange(course)}
                    >
                      <i className={`bi ${
                        course.status === "PUBLISHED"
                          ? "bi-eye-slash"
                          : "bi-send-check"
                      } me-1`}></i>
                      {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(course)}
                      disabled={course.status === "PUBLISHED"}
                      title={
                        course.status === "PUBLISHED"
                          ? "Unpublish before deleting"
                          : "Delete draft"
                      }
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default InstructorCoursesPage;
