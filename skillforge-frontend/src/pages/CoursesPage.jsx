import { useEffect, useState } from "react";

import getErrorMessage from "../api/getErrorMessage";
import {
  courseApi,
  wishlistApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCourses(query = "") {
    setLoading(true);

    try {
      const response = await courseApi.list(query);
      setCourses(response.data);
      setMessage("");
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Unable to load courses")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleWishlist(course) {
    if (user?.role !== "STUDENT") {
      setMessage("Login as a student to use the wishlist.");
      return;
    }

    try {
      await wishlistApi.add(course.id);
      setMessage(`${course.title} was added to your wishlist.`);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    loadCourses(search);
  }

  return (
    <div className="container py-5">
      <div className="row align-items-end g-3 mb-4">
        <div className="col-lg">
          <p className="text-primary fw-semibold mb-1">
            COURSE CATALOGUE
          </p>
          <h1 className="fw-bold mb-1">
            Find your next skill
          </h1>
          <p className="text-secondary mb-0">
            Browse courses approved by the SkillForge team.
          </p>
        </div>

        <div className="col-lg-5">
          <form className="input-group" onSubmit={handleSearch}>
            <input
              className="form-control"
              placeholder="Search courses"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
            <button className="btn btn-primary">
              <i className="bi bi-search me-1"></i>
              Search
            </button>
          </form>
        </div>
      </div>

      <AlertMessage type="info">{message}</AlertMessage>

      {loading ? (
        <LoadingSpinner message="Loading courses..." />
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <CourseCard
                course={course}
                showWishlist
                onWishlist={handleWishlist}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-search"></i>
          <p>No approved courses match your search.</p>
        </div>
      )}
    </div>
  );
}
