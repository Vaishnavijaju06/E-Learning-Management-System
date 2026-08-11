import { Link } from "react-router-dom";

export default function CourseCard({
  course,
  onWishlist,
  showWishlist = false,
  isWishlisted = false
}) {
  const price = Number(course.price) || 0;

  return (
    <article className="card course-card h-100 border-0">
      <div className="course-image-wrapper">
        <img
          src={
            course.thumbnailUrl ||
            "/course-placeholder.svg"
          }
          className="card-img-top course-image"
          alt={course.title || "Course thumbnail"}
          onError={(event) => {
            event.currentTarget.src =
              "/course-placeholder.svg";
          }}
        />

        <span className="course-category-chip">
          {course.categoryName || "Course"}
        </span>

        {showWishlist && (
          <button
            type="button"
            className={`btn wishlist-button${isWishlisted ? " active" : ""
              }`}
            onClick={() => onWishlist(course)}
            aria-label={
              isWishlisted
                ? `Remove ${course.title} from wishlist`
                : `Add ${course.title} to wishlist`
            }
          >
            <i
              className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"
                }`}
            ></i>
          </button>
        )}
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="course-level">
            <i className="bi bi-bar-chart-fill me-1"></i>
            {course.level || "All levels"}
          </span>
        </div>

        <h3 className="h5 course-card-title">
          {course.title}
        </h3>

        <p className="small text-secondary line-clamp-3 flex-grow-1">
          {course.description}
        </p>

        <div className="course-instructor mb-3">
          <span className="course-instructor-avatar">
            {course.instructorName
              ?.charAt(0)
              ?.toUpperCase() || "I"}
          </span>
          <span>
            <small>Instructor</small>
            <strong>
              {course.instructorName || "SkillForge"}
            </strong>
          </span>
        </div>

        <div className="course-card-footer">
          <div>
            <small className="text-secondary d-block">
              Course fee
            </small>
            <strong className="course-price">
              {price === 0
                ? "Free"
                : `₹${price.toFixed(0)}`}
            </strong>
          </div>

          <Link
            className="btn btn-primary course-view-btn"
            to={`/courses/${course.id}`}
          >
            View Course
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}
