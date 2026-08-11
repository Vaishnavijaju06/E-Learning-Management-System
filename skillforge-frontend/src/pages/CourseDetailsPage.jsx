import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import loadRazorpay from "../utils/loadRazorpay";
import getErrorMessage from "../api/getErrorMessage";

import {
  courseApi,
  enrollmentApi,
  paymentApi,
  wishlistApi
} from "../api/skillforgeApi";

import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [checkoutError, setCheckoutError] =
    useState("");
  const [isEnrolled, setIsEnrolled] =
    useState(false);
  const [isWishlisted, setIsWishlisted] =
    useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (user?.role !== "STUDENT") {
      setIsEnrolled(false);
      return;
    }

    checkEnrollment();
  }, [courseId, user]);

  useEffect(() => {
    if (user?.role !== "STUDENT") {
      setIsWishlisted(false);
      return;
    }

    checkWishlist();
  }, [courseId, user]);

  async function loadCourse() {
    try {
      setLoading(true);
      setMessage("");

      const response =
        await courseApi.get(courseId);

      setCourse(response.data);
    } catch (error) {
      setCourse(null);

      setMessage(
        getErrorMessage(
          error,
          "Course was not found"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function checkEnrollment() {
    try {
      const response =
        await enrollmentApi.mine();

      const enrollments = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      const enrolled = enrollments.some(
        (enrollment) =>
          String(enrollment.courseId) ===
          String(courseId)
      );

      setIsEnrolled(enrolled);
    } catch (error) {
      console.error(
        "Unable to check enrollment:",
        error
      );

      setIsEnrolled(false);
    }
  }

  function purchase() {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/courses/${courseId}`
        }
      });

      return;
    }

    if (user.role !== "STUDENT") {
      const warning = "Only students can enroll in courses.";
      setMessage(warning);
      toast.warning(warning);

      return;
    }

    completePurchase();
  }

  async function completePurchase() {
    if (!course) {
      const errorMessage =
        "Course information is not available.";
      setCheckoutError(errorMessage);
      toast.error(errorMessage);

      return;
    }

    setWorking(true);
    setCheckoutError("");
    setMessage("");

    try {
      const scriptLoaded =
        await loadRazorpay();

      if (!scriptLoaded) {
        const errorMessage =
          "Unable to load Razorpay Checkout. Check your internet connection.";
        setCheckoutError(errorMessage);
        toast.error(errorMessage);

        return;
      }

      const response =
        await paymentApi.createRazorpayOrder(
          course.id
        );

      const order = response.data;

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "SkillForge",
        description: order.courseTitle,
        order_id: order.razorpayOrderId,

        prefill: {
          name: order.studentName,
          email: order.studentEmail
        },

        notes: {
          courseId: String(order.courseId),
          paymentRecordId: String(
            order.paymentRecordId
          )
        },

        theme: {
          color: "#4f46e5"
        },

        handler: async function (
          paymentResponse
        ) {
          try {
            setWorking(true);
            setCheckoutError("");

            await paymentApi.verifyRazorpayPayment({
              razorpayOrderId:
                paymentResponse.razorpay_order_id,

              razorpayPaymentId:
                paymentResponse.razorpay_payment_id,

              razorpaySignature:
                paymentResponse.razorpay_signature
            });

            setIsEnrolled(true);

            toast.success(
              "Payment successful. Course added to My Learning."
            );

            navigate("/student/learning");
          } catch (error) {
            const errorMessage = getErrorMessage(
              error,
              "Payment verification failed"
            );
            setCheckoutError(errorMessage);
            toast.error(errorMessage);
          } finally {
            setWorking(false);
          }
        },

        modal: {
          ondismiss: function () {
            const warning =
              "Payment was cancelled. You can try again.";
            setCheckoutError(warning);
            toast.warning(warning);

            setWorking(false);
          }
        }
      };

      const razorpayCheckout =
        new window.Razorpay(options);

      razorpayCheckout.on(
        "payment.failed",
        function (failureResponse) {
          console.error(
            "Razorpay payment failed:",
            failureResponse.error
          );

          const errorMessage =
            failureResponse.error?.description ||
            "Payment failed. Please try again.";
          setCheckoutError(errorMessage);
          toast.error(errorMessage);

          setWorking(false);
        }
      );

      razorpayCheckout.open();
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Unable to start Razorpay payment"
      );
      setCheckoutError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setWorking(false);
    }
  }

  async function checkWishlist() {
    try {
      const response = await wishlistApi.mine();

      const wishlist = Array.isArray(response.data)
        ? response.data
        : [];

      const wishlisted = wishlist.some(
        (item) =>
          String(item.id) === String(courseId)
      );

      setIsWishlisted(wishlisted);
    } catch (error) {
      console.error(
        "Unable to check wishlist:",
        error
      );

      setIsWishlisted(false);
    }
  }

  async function addWishlist() {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/courses/${courseId}`
        }
      });

      return;
    }

    if (user.role !== "STUDENT") {
      const warning =
        "Only students can add courses to the wishlist.";
      setMessage(warning);
      toast.warning(warning);

      return;
    }

    try {
      setMessage("");
      setCheckoutError("");

      if (isWishlisted) {
        await wishlistApi.remove(course.id);
        setIsWishlisted(false);

        const successMessage =
          "Course removed from your wishlist.";
        setMessage(successMessage);
        toast.success(successMessage);
      } else {
        await wishlistApi.add(course.id);
        setIsWishlisted(true);

        const successMessage =
          "Course added to your wishlist.";
        setMessage(successMessage);
        toast.success(successMessage);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Unable to update wishlist"
      );
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return (
      <LoadingSpinner message="Loading course..." />
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <AlertMessage type="danger">
          {message ||
            "Course information is unavailable."}
        </AlertMessage>

        <Link
          to="/courses"
          className="btn btn-primary mt-3"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  const coursePrice =
    Number(course.price) || 0;

  return (
    <div>
      <section className="course-detail-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <span className="badge text-bg-warning mb-3">
                {course.categoryName ||
                  "Course"}
              </span>

              <h1 className="display-5 fw-bold">
                {course.title}
              </h1>

              <p className="lead opacity-75">
                {course.description}
              </p>

              <p className="mb-0">
                Created by{" "}
                <strong>
                  {course.instructorName}
                </strong>
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
                  onError={(event) => {
                    event.currentTarget.src =
                      "/course-placeholder.svg";
                  }}
                />

                <div className="card-body">
                  <p className="h3 text-primary fw-bold">
                    {coursePrice === 0
                      ? "Free"
                      : `₹${coursePrice.toFixed(0)}`}
                  </p>

                  {!user ||
                    user.role === "STUDENT" ? (
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
                          onClick={purchase}
                          disabled={working}
                        >
                          {working
                            ? "Opening Payment..."
                            : coursePrice === 0
                              ? "Enroll Now"
                              : "Buy Now"}
                        </button>
                      )}

                      <button
                        type="button"
                        className={`btn w-100${isWishlisted
                            ? " btn-danger"
                            : " btn-outline-secondary"
                          }`}
                        onClick={addWishlist}
                        disabled={working}
                      >
                        <i
                          className={`bi me-2 ${isWishlisted
                              ? "bi-heart-fill"
                              : "bi-heart"
                            }`}
                        ></i>
                        {isWishlisted
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                      </button>
                    </>
                  ) : (
                    <p className="small text-secondary mb-0">
                      Use a student account to enroll
                      in this course.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        {message && (
          <AlertMessage type="info">
            {message}
          </AlertMessage>
        )}

        {checkoutError && (
          <AlertMessage type="danger">
            {checkoutError}
          </AlertMessage>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <h2 className="h4 fw-bold">
              What you will learn
            </h2>

            <p className="text-secondary">
              Follow structured modules and
              lessons, complete practice quizzes,
              track your progress and receive a
              verified certificate after
              completion.
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

        <Link
          to="/courses"
          className="btn btn-link px-0 mt-4"
        >
          ← Back to courses
        </Link>
      </div>
    </div>
  );
}