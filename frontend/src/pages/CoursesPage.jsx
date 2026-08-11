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
import { useToast } from "../context/ToastContext";

export default function CoursesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [wishlistedIds, setWishlistedIds] = useState(
    new Set()
  );

  async function loadWishlistIds() {
    if (user?.role !== "STUDENT") {
      setWishlistedIds(new Set());
      return;
    }

    try {
      const response = await wishlistApi.mine();
      setWishlistedIds(
        new Set(response.data.map((course) => course.id))
      );
    } catch (error) {
      // Silently ignore - wishlist highlighting is non-critical
    }
  }

  async function loadCourses(query = "") {
    setLoading(true);

    try {
      const response = await courseApi.list(query);
      setCourses(response.data);
      setMessage("");
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Unable to load courses"
      );
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
    loadWishlistIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleWishlist(course) {
    if (user?.role !== "STUDENT") {
      const warning =
        "Login as a student to use the wishlist.";
      setMessage(warning);
      toast.warning(warning);
      return;
    }

    const alreadyWishlisted = wishlistedIds.has(course.id);

    try {
      if (alreadyWishlisted) {
        await wishlistApi.remove(course.id);
        setWishlistedIds((current) => {
          const next = new Set(current);
          next.delete(course.id);
          return next;
        });
        const successMessage =
          `${course.title} was removed from your wishlist.`;
        setMessage(successMessage);
        toast.success(successMessage);
      } else {
        await wishlistApi.add(course.id);
        setWishlistedIds((current) => {
          const next = new Set(current);
          next.add(course.id);
          return next;
        });
        const successMessage =
          `${course.title} was added to your wishlist.`;
        setMessage(successMessage);
        toast.success(successMessage);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    loadCourses(search.trim());
  }

  function clearSearch() {
    setSearch("");
    loadCourses();
  }

  return (
    <div className="container py-5">
      <section className="catalogue-header mb-5">
        <div>
          <span className="section-eyebrow text-warning">
            Course catalogue
          </span>
          <h1>Find your next skill</h1>
          <p>
            Browse approved courses, compare topics and choose the
            learning path that fits your goals.
          </p>
        </div>

        <form
          className="catalogue-search"
          onSubmit={handleSearch}
        >
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control border-start-0 border-end-0"
              placeholder="Search courses by title or topic"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
            {search && (
              <button
                type="button"
                className="btn btn-light border-top border-bottom"
                onClick={clearSearch}
                title="Clear search"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
            <button className="btn btn-warning px-4">
              Search
            </button>
          </div>
        </form>
      </section>

      <AlertMessage type="info">{message}</AlertMessage>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">
            Available Courses
          </h2>
          <p className="small text-secondary mb-0">
            {courses.length} course
            {courses.length === 1 ? "" : "s"} found
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading courses..." />
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-search"></i>
          </div>
          <h3 className="h5">No matching courses</h3>
          <p className="mb-3">
            Try a different keyword or clear the search.
          </p>
          {search && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={clearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <CourseCard
                course={course}
                showWishlist
                onWishlist={handleWishlist}
                isWishlisted={wishlistedIds.has(course.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}