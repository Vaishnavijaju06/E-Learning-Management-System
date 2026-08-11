import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { wishlistApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export default function WishlistPage() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    wishlistApi
      .mine()
      .then((response) => setCourses(response.data))
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        setMessage(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  }, [toast]);

  async function remove(course) {
    try {
      await wishlistApi.remove(course.id);
      setCourses((current) =>
        current.filter((item) => item.id !== course.id)
      );
      const successMessage =
        "Course removed from your wishlist.";
      setMessage(successMessage);
      toast.success(successMessage);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading wishlist..." />;
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div className="section-heading">
          <span className="section-eyebrow">Saved courses</span>
          <h1>My Wishlist</h1>
          <p>
            Keep track of courses you would like to explore later.
          </p>
        </div>
        <Link to="/courses" className="btn btn-outline-primary">
          Browse Courses
        </Link>
      </div>

      <AlertMessage type="info">{message}</AlertMessage>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-heart"></i>
          </div>
          <h2 className="h4">Your wishlist is empty</h2>
          <p className="text-secondary mb-3">
            Save courses from the catalogue to see them here.
          </p>
          <Link className="btn btn-primary" to="/courses">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <CourseCard
                course={course}
                showWishlist
                onWishlist={remove}
                isWishlisted
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}