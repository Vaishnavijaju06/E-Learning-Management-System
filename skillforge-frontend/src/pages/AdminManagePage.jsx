import { useEffect, useState } from "react";

import getErrorMessage from "../api/getErrorMessage";
import {
  categoryApi,
  courseApi,
  userApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminManagePage() {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);

    try {
      const [categoryResult, userResult, courseResult] =
        await Promise.all([
          categoryApi.list(),
          userApi.all(),
          courseApi.pending()
        ]);

      setCategories(categoryResult.data);
      setUsers(userResult.data);
      setPendingCourses(courseResult.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveCategory(event) {
    event.preventDefault();
    setError("");

    try {
      if (categoryForm.id) {
        await categoryApi.update(
          categoryForm.id,
          categoryForm
        );
      } else {
        await categoryApi.create(categoryForm);
      }

      setCategoryForm({
        id: null,
        name: "",
        description: ""
      });
      setMessage("Category saved.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await categoryApi.remove(id);
      setMessage("Category deleted.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function setUserStatus(id, status) {
    try {
      await userApi.setStatus(id, status);
      setMessage(`User status changed to ${status}.`);
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function setCourseStatus(id, status) {
    try {
      await courseApi.setStatus(id, status);
      setMessage(`Course ${status.toLowerCase()}.`);
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading administration..." />;
  }

  return (
    <div className="container py-5">
      <p className="text-primary fw-semibold mb-1">
        ADMINISTRATION
      </p>
      <h1 className="fw-bold mb-4">
        Platform Management
      </h1>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage type="success">{message}</AlertMessage>

      <ul className="nav nav-pills mb-4" role="tablist">
        <li className="nav-item">
          <button
            className="nav-link active"
            data-bs-toggle="tab"
            data-bs-target="#categories"
          >
            Categories
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#users"
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#approvals"
          >
            Course Approvals
            <span className="badge text-bg-danger ms-2">
              {pendingCourses.length}
            </span>
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="categories"
        >
          <div className="row g-4">
            <div className="col-lg-4">
              <form
                className="card border-0 shadow-sm"
                onSubmit={saveCategory}
              >
                <div className="card-body">
                  <h2 className="h5">
                    {categoryForm.id
                      ? "Edit Category"
                      : "Add Category"}
                  </h2>
                  <label className="form-label mt-3">
                    Name
                  </label>
                  <input
                    className="form-control"
                    required
                    value={categoryForm.name}
                    onChange={(event) =>
                      setCategoryForm({
                        ...categoryForm,
                        name: event.target.value
                      })
                    }
                  />
                  <label className="form-label mt-3">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={categoryForm.description}
                    onChange={(event) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: event.target.value
                      })
                    }
                  ></textarea>
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary">
                      Save
                    </button>
                    {categoryForm.id && (
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() =>
                          setCategoryForm({
                            id: null,
                            name: "",
                            description: ""
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

            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="fw-semibold">
                            {category.name}
                          </td>
                          <td>{category.description}</td>
                          <td className="text-end text-nowrap">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() =>
                                setCategoryForm(category)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                deleteCategory(category.id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="users">
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>
                          {user.firstName} {user.lastName}
                        </strong>
                        <div className="small text-secondary">
                          {user.email}
                        </div>
                      </td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.status === "ACTIVE"
                              ? "text-bg-success"
                              : user.status === "PENDING"
                                ? "text-bg-warning"
                                : "text-bg-secondary"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {user.status !== "ACTIVE" && (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() =>
                              setUserStatus(
                                user.id,
                                "ACTIVE"
                              )
                            }
                          >
                            Activate
                          </button>
                        )}
                        {user.status === "ACTIVE" &&
                          user.role !== "ADMIN" && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setUserStatus(
                                  user.id,
                                  "INACTIVE"
                                )
                              }
                            >
                              Deactivate
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="approvals">
          <div className="row g-3">
            {pendingCourses.map((course) => (
              <div className="col-lg-6" key={course.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <span className="badge text-bg-warning">
                      Pending Approval
                    </span>
                    <h2 className="h5 mt-3">
                      {course.title}
                    </h2>
                    <p className="text-secondary small">
                      {course.description}
                    </p>
                    <p className="small">
                      Instructor: {course.instructorName}
                    </p>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() =>
                        setCourseStatus(
                          course.id,
                          "APPROVED"
                        )
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setCourseStatus(
                          course.id,
                          "REJECTED"
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingCourses.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-check2-circle"></i>
              <p>No courses are waiting for approval.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
