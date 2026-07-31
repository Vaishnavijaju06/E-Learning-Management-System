import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import {
  courseApi,
  enrollmentApi,
  paymentApi,
  wishlistApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import CheckoutModal from "../components/CheckoutModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    courseApi
      .get(courseId)
      .then((response) => setCourse(response.data))
      .catch((error) =>
        setMessage(
          getErrorMessage(error, "Course was not found")
        )
      )
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (user?.role !== "STUDENT") {
      return;
    }

    enrollmentApi
      .mine()
      .then((response) =>
        setIsEnrolled(
          response.data.some(
            (enrollment) =>
              String(enrollment.courseId) === String(courseId)
          )
        )
      )
      .catch(() => setIsEnrolled(false));
  }, [courseId, user]);

  function purchase() {
    if (!user) {
      navigate("/login", {
        state: { from: `/courses/${courseId}` }
      });
      return;
    }

    if (user.role !== "STUDENT") {
      setMessage("Only students can enroll in courses.");
      return;
    }

    setCheckoutError("");
    setShowCheckout(true);
  }

  async function completePurchase() {
    setWorking(true);

    try {
      await paymentApi.checkout(course.id);
      setShowCheckout(false);
      navigate("/student/learning");
    } catch (error) {
      setCheckoutError(getErrorMessage(error));
    } finally {
      setWorking(false);
    }
  }

  async function addWishlist() {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await wishlistApi.add(course.id);
      setMessage("Course added to your wishlist.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading course..." />;
  }

  if (!course) {
    return (
      <div className="container py-5">
        <AlertMessage>{message}</AlertMessage>
      </div>
    );
  }

  return (
    <div>
      <section className="course-detail-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <span className="badge text-bg-warning mb-3">
                {course.categoryName}
              </span>

              <h1 className="display-5 fw-bold">
                {course.title}
              </h1>

              <p className="lead opacity-75">
                {course.description}
              </p>

              <p className="mb-0">
                Created by <strong>{course.instructorName}</strong>
                {" · "}
                {course.level}
              </p>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg">
                <img
                  src={
                    course.thumbnailUrl ||
                    "/course-placeholder.svg"
                  }
                  className="card-img-top course-detail-image"
                  alt={course.title}
                />

                <div className="card-body">
                  <p className="h3 text-primary fw-bold">
                    {Number(course.price) === 0
                      ? "Free"
                      : `₹${Number(course.price).toFixed(0)}`}
                  </p>

                  {!user || user.role === "STUDENT" ? (
                    <>
                      {isEnrolled ? (
                        <Link
                          className="btn btn-success w-100 mb-2"
                          to={`/student/learning/${course.id}`}
                        >
                          <i className="bi bi-play-circle me-2"></i>
                          Go to Course
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary w-100 mb-2"
                          disabled={working}
                          onClick={purchase}
                        >
                          {working
                            ? "Processing..."
                            : Number(course.price) === 0
                              ? "Enroll Now"
                              : "Buy Now"}
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100"
                        onClick={addWishlist}
                      >
                        <i className="bi bi-heart me-2"></i>
                        Add to Wishlist
                      </button>
                    </>
                  ) : (
                    <p className="small text-secondary mb-0">
                      Use a student account to enroll in this course.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <AlertMessage type="info">{message}</AlertMessage>

        <div className="row g-4">
          <div className="col-lg-8">
            <h2 className="h4 fw-bold">
              What you will learn
            </h2>

            <p className="text-secondary">
              Follow structured modules and lessons, complete
              practice quizzes, track your progress and receive
              a verified certificate after completion.
            </p>
          </div>

          <div className="col-lg-4">
            <div className="bg-light rounded-4 p-4">
              <h3 className="h6 fw-bold">
                Course includes
              </h3>

              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <i className="bi bi-play-circle me-2"></i>
                  Video and text lessons
                </li>

                <li className="mb-2">
                  <i className="bi bi-check2-square me-2"></i>
                  Module quizzes
                </li>

                <li>
                  <i className="bi bi-award me-2"></i>
                  Completion certificate
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Link to="/courses" className="btn btn-link px-0 mt-4">
          ← Back to courses
        </Link>
      </div>

      {showCheckout && (
        <CheckoutModal
          course={course}
          user={user}
          processing={working}
          error={checkoutError}
          onClose={() => setShowCheckout(false)}
          onConfirm={completePurchase}
        />
      )}
    </div>
  );
}