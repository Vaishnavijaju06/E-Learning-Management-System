import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CourseCard from "../../components/course/CourseCard";
import {
  courseDetails,
  defaultCourseDetails,
} from "../../data/courseDetails";
import courseService from "../../services/courseService";
import { isCourseEnrolled } from "../../services/enrollmentService";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    const wishlist = JSON.parse(
      localStorage.getItem("skillforgeWishlist") || "[]"
    );

    setWishlisted(wishlist.includes(Number(courseId)));
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const [selectedCourse, courses] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getAllCourses(),
      ]);

      setCourse(selectedCourse);
      setAllCourses(courses);
    } catch (loadError) {
      setError(loadError.message || "Unable to load this course.");
    } finally {
      setLoading(false);
    }
  };

  const details = useMemo(() => {
    return courseDetails[courseId] || defaultCourseDetails;
  }, [courseId]);

  const relatedCourses = useMemo(() => {
    if (!course) {
      return [];
    }

    return allCourses
      .filter(
        (item) =>
          item.id !== course.id &&
          item.category === course.category
      )
      .slice(0, 3);
  }, [allCourses, course]);

  const toggleWishlist = () => {
    const courseIdNumber = Number(courseId);

    const currentWishlist = JSON.parse(
      localStorage.getItem("skillforgeWishlist") || "[]"
    );

    let updatedWishlist;

    if (currentWishlist.includes(courseIdNumber)) {
      updatedWishlist = currentWishlist.filter(
        (id) => id !== courseIdNumber
      );

      setWishlisted(false);
      toast.info("Course removed from wishlist.");
    } else {
      updatedWishlist = [...currentWishlist, courseIdNumber];

      setWishlisted(true);
      toast.success("Course added to wishlist.");
    }

    localStorage.setItem(
      "skillforgeWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const handleEnrollment = () => {
    if (isCourseEnrolled(course.id)) {
      toast.info("You have already purchased this course.");
      navigate(`/student/courses/${course.id}/learn`);
      return;
    }

    localStorage.setItem(
      "skillforgeSelectedCourse",
      JSON.stringify(course)
    );

    if (course.price === 0) {
      toast.success("Course selected for free enrollment.");
      navigate("/student/courses");
      return;
    }

    navigate(`/student/checkout/${course.id}`);
  };

  if (loading) {
    return (
      <main className="container py-5 text-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-secondary mt-3">Loading course details...</p>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="container py-5 min-vh-100">
        <div className="alert alert-danger text-center">
          <h4 className="fw-bold">Course Not Found</h4>
          <p>{error}</p>

          <Link to="/courses" className="btn btn-danger">
            Return to Courses
          </Link>
        </div>
      </main>
    );
  }

  const discount =
    course.originalPrice > course.price
      ? Math.round(
        ((course.originalPrice - course.price) /
          course.originalPrice) *
        100
      )
      : 0;
  const alreadyEnrolled =
    course && isCourseEnrolled(course.id);

  return (
    <main className="section-light min-vh-100">
      <section className="bg-dark text-white py-5">
        <div className="container py-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link className="text-white-50" to="/">
                  Home
                </Link>
              </li>

              <li className="breadcrumb-item">
                <Link className="text-white-50" to="/courses">
                  Courses
                </Link>
              </li>

              <li
                className="breadcrumb-item active text-white"
                aria-current="page"
              >
                {course.title}
              </li>
            </ol>
          </nav>

          <div className="row g-5 align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-primary mb-3">
                {course.category}
              </span>

              <h1 className="display-5 fw-bold">{course.title}</h1>

              <p className="lead text-white-50">
                {details.subtitle}
              </p>

              <div className="d-flex flex-wrap gap-4">
                <span className="text-warning">
                  <i className="bi bi-star-fill me-1"></i>
                  {course.rating}
                </span>

                <span>
                  <i className="bi bi-people me-1"></i>
                  {course.students.toLocaleString("en-IN")} students
                </span>

                <span>
                  <i className="bi bi-translate me-1"></i>
                  {course.language}
                </span>

                <span>
                  <i className="bi bi-bar-chart me-1"></i>
                  {course.level}
                </span>
              </div>

              <p className="mt-4 mb-0">
                Created by{" "}
                <strong className="text-info">
                  {course.instructor}
                </strong>
              </p>
            </div>

            <div className="col-lg-4">
              <div
                className={`bg-${course.color}-subtle text-${course.color} rounded-4 text-center py-5`}
              >
                <i className={`bi ${course.icon} display-1`}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-8">
            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-3">About This Course</h3>
                <p className="text-secondary mb-0">
                  {details.description}
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  What You Will Learn
                </h3>

                <div className="row g-3">
                  {details.outcomes.map((outcome) => (
                    <div className="col-md-6" key={outcome}>
                      <div className="d-flex gap-2">
                        <i className="bi bi-check-circle-fill text-success"></i>
                        <span>{outcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Course Curriculum</h3>

                <div className="accordion" id="courseCurriculum">
                  {details.curriculum.map((section, index) => (
                    <div
                      className="accordion-item"
                      key={section.id}
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${index !== 0 ? "collapsed" : ""
                            }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#section-${section.id}`}
                        >
                          <span className="fw-semibold">
                            {section.title}
                          </span>

                          <small className="ms-auto me-3 text-secondary">
                            {section.duration}
                          </small>
                        </button>
                      </h2>

                      <div
                        id={`section-${section.id}`}
                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""
                          }`}
                        data-bs-parent="#courseCurriculum"
                      >
                        <div className="accordion-body">
                          {section.lessons.map((lesson) => (
                            <div
                              className="d-flex align-items-center py-2 border-bottom"
                              key={lesson}
                            >
                              <i className="bi bi-play-circle text-primary me-3"></i>
                              <span>{lesson}</span>

                              <span className="badge bg-light text-dark ms-auto">
                                Preview
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">Requirements</h3>

                <ul className="mb-0">
                  {details.requirements.map((requirement) => (
                    <li className="mb-2" key={requirement}>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow rounded-4 sticky-lg-top"
              style={{ top: "100px" }}
            >
              <div className="card-body p-4">
                {course.price === 0 ? (
                  <h2 className="fw-bold text-success">Free</h2>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-2">
                      <h2 className="fw-bold mb-0">
                        ₹{course.price.toLocaleString("en-IN")}
                      </h2>

                      <span className="text-decoration-line-through text-secondary">
                        ₹{course.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {discount > 0 && (
                      <span className="badge bg-danger mt-2">
                        {discount}% discount
                      </span>
                    )}
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-primary-custom w-100 py-3 mt-4"
                  onClick={handleEnrollment}
                >
                  {alreadyEnrolled
                    ? "Go to Course"
                    : course.price === 0
                      ? "Enroll for Free"
                      : "Buy This Course"}
                </button>

                <button
                  type="button"
                  className={`btn w-100 mt-2 ${wishlisted
                    ? "btn-danger"
                    : "btn-outline-danger"
                    }`}
                  onClick={toggleWishlist}
                >
                  <i
                    className={`bi ${wishlisted ? "bi-heart-fill" : "bi-heart"
                      } me-2`}
                  ></i>

                  {wishlisted
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>

                <hr />

                <h5 className="fw-bold">This course includes:</h5>

                <div className="d-flex flex-column gap-3 mt-3">
                  <span>
                    <i className="bi bi-clock me-2 text-primary"></i>
                    {course.duration} of content
                  </span>

                  <span>
                    <i className="bi bi-play-btn me-2 text-primary"></i>
                    {course.lessons} lessons
                  </span>

                  <span>
                    <i className="bi bi-phone me-2 text-primary"></i>
                    Mobile and desktop access
                  </span>

                  <span>
                    <i className="bi bi-infinity me-2 text-primary"></i>
                    Lifetime access
                  </span>

                  <span>
                    <i className="bi bi-award me-2 text-primary"></i>
                    Completion certificate
                  </span>
                </div>

                <hr />

                <small className="text-secondary">
                  Last updated: {details.lastUpdated}
                </small>
              </div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <section className="pt-5 mt-4">
            <div className="d-flex justify-content-between mb-4">
              <h2 className="fw-bold">Related Courses</h2>

              <Link to="/courses" className="btn btn-outline-primary">
                View All
              </Link>
            </div>

            <div className="row g-4">
              {relatedCourses.map((relatedCourse) => (
                <div
                  className="col-md-6 col-xl-4"
                  key={relatedCourse.id}
                >
                  <CourseCard course={relatedCourse} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default CourseDetailsPage;