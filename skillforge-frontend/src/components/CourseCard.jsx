import { Link } from "react-router-dom";

export default function CourseCard({
  course,
  onWishlist,
  showWishlist = false
}) {
  return (
    <article className="card course-card h-100 border-0 shadow-sm">
      <div className="course-image-wrapper">
        <img
          src={
            course.thumbnailUrl ||
            "/course-placeholder.svg"
          }
          className="card-img-top course-image"
          alt=""
        />

        {showWishlist && (
          <button
            type="button"
            className="btn btn-light rounded-circle wishlist-button"
            onClick={() => onWishlist(course)}
            aria-label="Toggle wishlist"
          >
            <i className="bi bi-heart"></i>
          </button>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <span className="badge text-bg-light">
            {course.categoryName}
          </span>
          <span className="small text-secondary">
            {course.level}
          </span>
        </div>

        <h3 className="h5">{course.title}</h3>

        <p className="small text-secondary line-clamp-3 flex-grow-1">
          {course.description}
        </p>

        <p className="small mb-2">
          <i className="bi bi-person me-1"></i>
          {course.instructorName}
        </p>

        <div className="d-flex align-items-center justify-content-between">
          <strong className="text-primary">
            {Number(course.price) === 0
              ? "Free"
              : `₹${Number(course.price).toFixed(0)}`}
          </strong>

          <Link
            className="btn btn-primary btn-sm"
            to={`/courses/${course.id}`}
          >
            View Course
          </Link>
        </div>
      </div>
    </article>
  );
}
