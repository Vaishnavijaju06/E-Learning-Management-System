import { useEffect, useState } from "react";

import getErrorMessage from "../api/getErrorMessage";
import { wishlistApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function WishlistPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    wishlistApi
      .mine()
      .then((response) => setCourses(response.data))
      .catch((error) => setMessage(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  async function remove(course) {
    try {
      await wishlistApi.remove(course.id);
      setCourses((current) =>
        current.filter((item) => item.id !== course.id)
      );
      setMessage("Course removed from your wishlist.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading wishlist..." />;
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">My Wishlist</h1>
      <AlertMessage type="info">{message}</AlertMessage>

      {courses.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-heart"></i>
          <h2 className="h4">Your wishlist is empty</h2>
          <p className="text-secondary mb-0">
            Save courses from the catalogue to see them here.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <CourseCard
                course={course}
                showWishlist
                onWishlist={remove}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
