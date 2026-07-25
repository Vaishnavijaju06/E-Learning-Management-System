import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import CourseCard from "../../components/course/CourseCard";
import courseService from "../../services/courseService";

import {
  getWishlistCourseIds,
  removeCourseFromWishlist,
} from "../../services/wishlistService";

function StudentWishlistPage() {
  const [wishlistCourses, setWishlistCourses] = useState([]);
  const [wishlistCourseIds, setWishlistCourseIds] = useState(
    () => getWishlistCourseIds()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWishlistCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const allCourses = await courseService.getAllCourses();
        const savedIds = getWishlistCourseIds();

        setWishlistCourseIds(savedIds);

        setWishlistCourses(
          allCourses.filter((course) =>
            savedIds.includes(Number(course.id))
          )
        );
      } catch (loadError) {
        setError(
          loadError.message || "Unable to load your wishlist."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWishlistCourses();
  }, []);

  const handleRemoveWishlist = (courseId) => {
    const updatedIds = removeCourseFromWishlist(courseId);

    setWishlistCourseIds(updatedIds);

    setWishlistCourses((currentCourses) =>
      currentCourses.filter(
        (course) => Number(course.id) !== Number(courseId)
      )
    );

    toast.info("Course removed from wishlist");
  };

  if (loading) {
    return (
      <main className="container-fluid p-4 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="text-secondary mt-3">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">My Wishlist</h1>

        <p className="text-secondary mb-0">
          Courses you saved for later.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!error && wishlistCourses.length === 0 && (
        <section className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-heart display-3 text-secondary"></i>

            <h3 className="fw-bold mt-3">
              Your wishlist is empty
            </h3>

            <p className="text-secondary">
              Browse courses and click the heart button to save them.
            </p>

            <Link to="/courses" className="btn btn-primary-custom">
              Browse Courses
            </Link>
          </div>
        </section>
      )}

      {!error && wishlistCourses.length > 0 && (
        <div className="row g-4">
          {wishlistCourses.map((course) => (
            <div
              className="col-md-6 col-xl-4"
              key={course.id}
            >
              <CourseCard
                course={course}
                viewMode="grid"
                isWishlisted={wishlistCourseIds.includes(
                  Number(course.id)
                )}
                onWishlist={handleRemoveWishlist}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default StudentWishlistPage;