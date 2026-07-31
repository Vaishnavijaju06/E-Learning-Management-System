import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import {
  categoryApi,
  courseApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

const newCourse = {
  id: null,
  title: "",
  description: "",
  price: 0,
  level: "BEGINNER",
  categoryId: "",
  thumbnailUrl: ""
};

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(newCourse);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [courseResult, categoryResult] =
        await Promise.all([
          courseApi.instructorList(),
          categoryApi.list()
        ]);

      setCourses(courseResult.data);
      setCategories(categoryResult.data);

      if (categoryResult.data[0]) {
        setForm((current) =>
          current.categoryId
            ? current
            : {
                ...current,
                categoryId: categoryResult.data[0].id
              }
        );
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function save(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      categoryId: Number(form.categoryId)
    };

    try {
      if (form.id) {
        await courseApi.update(form.id, payload);
      } else {
        await courseApi.create(payload);
      }

      setForm({
        ...newCourse,
        categoryId: categories[0]?.id || ""
      });
      setMessage("Course saved as a draft.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function submit(id) {
    try {
      await courseApi.submit(id);
      setMessage("Course sent for admin approval.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this course?")) {
      return;
    }

    try {
      await courseApi.remove(id);
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  function edit(course) {
    setForm({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      level: course.level,
      categoryId: course.categoryId,
      thumbnailUrl: course.thumbnailUrl || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return <LoadingSpinner message="Loading your courses..." />;
  }

  return (
    <div className="container py-5">
      <p className="text-primary fw-semibold mb-1">
        INSTRUCTOR
      </p>
      <h1 className="fw-bold mb-4">Manage Courses</h1>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage type="success">{message}</AlertMessage>

      <div className="row g-4">
        <div className="col-lg-5">
          <form
            className="card border-0 shadow-sm"
            onSubmit={save}
          >
            <div className="card-body p-4">
              <h2 className="h5">
                {form.id ? "Edit Course" : "Create Course"}
              </h2>

              <label className="form-label mt-3">Title</label>
              <input
                name="title"
                className="form-control"
                required
                value={form.title}
                onChange={update}
              />

              <label className="form-label mt-3">
                Description
              </label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                required
                value={form.description}
                onChange={update}
              ></textarea>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label mt-3">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.price}
                    onChange={update}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label mt-3">
                    Level
                  </label>
                  <select
                    name="level"
                    className="form-select"
                    value={form.level}
                    onChange={update}
                  >
                    <option>BEGINNER</option>
                    <option>INTERMEDIATE</option>
                    <option>ADVANCED</option>
                  </select>
                </div>
              </div>

              <label className="form-label mt-3">
                Category
              </label>
              <select
                name="categoryId"
                className="form-select"
                required
                value={form.categoryId}
                onChange={update}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <label className="form-label mt-3">
                Thumbnail URL
              </label>
              <input
                name="thumbnailUrl"
                className="form-control"
                value={form.thumbnailUrl}
                onChange={update}
              />

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-primary">
                  Save Course
                </button>
                {form.id && (
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      setForm({
                        ...newCourse,
                        categoryId:
                          categories[0]?.id || ""
                      })
                    }
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-7">
          <div className="d-grid gap-3">
            {courses.map((course) => (
              <div
                className="card border-0 shadow-sm"
                key={course.id}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <span className="badge text-bg-light">
                        {course.status}
                      </span>
                      <h2 className="h5 mt-2">
                        {course.title}
                      </h2>
                      <p className="small text-secondary mb-0">
                        {course.categoryName} · ₹
                        {Number(course.price).toFixed(0)}
                      </p>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-light"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-three-dots"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => edit(course)}
                          >
                            Edit details
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => remove(course.id)}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to={`/instructor/courses/${course.id}/builder`}
                    >
                      Modules, Lessons & Quiz
                    </Link>
                    {(course.status === "DRAFT" ||
                      course.status === "REJECTED") && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => submit(course.id)}
                      >
                        Submit for Approval
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
