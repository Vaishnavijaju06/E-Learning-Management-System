import { Link } from "react-router-dom";

function CourseCard({
  course,
  viewMode = "grid",
  isWishlisted = false,
  onWishlist,
}) {
  const discount =
    course.originalPrice > course.price
      ? Math.round(
          ((course.originalPrice - course.price) /
            course.originalPrice) *
            100
        )
      : 0;

  const handleWishlistClick = (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (onWishlist) {
    onWishlist(course.id);
  }
};

  const wishlistButton = (
  <button
    type="button"
    className={`course-wishlist-button ${
      isWishlisted ? "active" : ""
    }`}
    onClick={handleWishlistClick}
    aria-label={
      isWishlisted
        ? `Remove ${course.title} from wishlist`
        : `Add ${course.title} to wishlist`
    }
  >
    <i
      className={`bi ${
        isWishlisted ? "bi-heart-fill" : "bi-heart"
      }`}
    ></i>
  </button>
);

  if (viewMode === "list") {
    return (
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 position-relative">
        {wishlistButton}

        <div className="row g-0">
          <div
            className={`col-md-4 bg-${course.color}-subtle text-${course.color} d-flex align-items-center justify-content-center py-5`}
          >
            <i className={`bi ${course.icon} display-2`}></i>
          </div>

          <div className="col-md-8">
            <div className="card-body p-4">
              <span className="badge bg-primary-subtle text-primary mb-2">
                {course.category}
              </span>

              <h4 className="fw-bold">{course.title}</h4>

              <p className="text-secondary">
                {course.shortDescription}
              </p>

              <p className="small text-secondary">
                By {course.instructor}
              </p>

              <div className="d-flex flex-wrap gap-3 small mb-3">
                <span className="text-warning">
                  <i className="bi bi-star-fill me-1"></i>
                  {course.rating}
                </span>

                <span>
                  <i className="bi bi-people me-1"></i>
                  {course.students.toLocaleString("en-IN")} students
                </span>

                <span>
                  <i className="bi bi-clock me-1"></i>
                  {course.duration}
                </span>

                <span>
                  <i className="bi bi-bar-chart me-1"></i>
                  {course.level}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {course.price === 0 ? (
                    <h5 className="text-success fw-bold mb-0">
                      Free
                    </h5>
                  ) : (
                    <>
                      <h5 className="fw-bold d-inline me-2">
                        ₹{course.price.toLocaleString("en-IN")}
                      </h5>

                      <span className="text-decoration-line-through text-secondary">
                        ₹
                        {course.originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </>
                  )}
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="btn btn-primary-custom"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card position-relative">
      {wishlistButton}

      <div
        className={`bg-${course.color}-subtle text-${course.color} text-center py-5 position-relative`}
      >
        <i className={`bi ${course.icon} display-2`}></i>

        {discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-3">
  {discount}% OFF
</span>
        )}
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-primary-subtle text-primary">
            {course.category}
          </span>

          <span className="small text-warning">
            <i className="bi bi-star-fill me-1"></i>
            {course.rating}
          </span>
        </div>

        <h5 className="fw-bold">{course.title}</h5>

        <p className="text-secondary small flex-grow-1">
          {course.shortDescription}
        </p>

        <p className="small text-secondary mb-2">
          By {course.instructor}
        </p>

        <div className="d-flex justify-content-between small text-secondary mb-3">
          <span>
            <i className="bi bi-people me-1"></i>
            {course.students.toLocaleString("en-IN")}
          </span>

          <span>
            <i className="bi bi-clock me-1"></i>
            {course.duration}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <div>
            {course.price === 0 ? (
              <h5 className="text-success fw-bold mb-0">
                Free
              </h5>
            ) : (
              <>
                <h5 className="fw-bold mb-0">
                  ₹{course.price.toLocaleString("en-IN")}
                </h5>

                <small className="text-decoration-line-through text-secondary">
                  ₹{course.originalPrice.toLocaleString("en-IN")}
                </small>
              </>
            )}
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="btn btn-sm btn-primary-custom"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;