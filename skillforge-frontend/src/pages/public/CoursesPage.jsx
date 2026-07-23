import { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/course/CourseCard";
import { categories } from "../../data/courses";
import courseService from "../../services/courseService";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [price, setPrice] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await courseService.getAllCourses();
      setCourses(response);
    } catch (loadError) {
      setError(loadError.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    const searchValue = searchText.trim().toLowerCase();

    if (searchValue) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchValue) ||
          course.category.toLowerCase().includes(searchValue) ||
          course.instructor.toLowerCase().includes(searchValue)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (course) => course.category === category
      );
    }

    if (level !== "All") {
      result = result.filter((course) => course.level === level);
    }

    if (price === "Free") {
      result = result.filter((course) => course.price === 0);
    }

    if (price === "Paid") {
      result = result.filter((course) => course.price > 0);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.students - a.students);
    }

    return result;
  }, [courses, searchText, category, level, price, sortBy]);

  const clearFilters = () => {
    setSearchText("");
    setCategory("All");
    setLevel("All");
    setPrice("All");
    setSortBy("popular");
  };

  return (
    <main className="section-light min-vh-100">
      <section className="bg-dark text-white py-5">
        <div className="container py-4">
          <span className="badge bg-primary mb-3">
            SkillForge Course Catalog
          </span>

          <h1 className="fw-bold">Find the right course for you</h1>

          <p className="text-white-50 mb-0">
            Learn practical skills through professionally designed courses.
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-lg-4">
                <label className="form-label fw-semibold">
                  Search
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Course, instructor or category"
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label fw-semibold">
                  Category
                </label>

                <select
                  className="form-select"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="All">All Categories</option>

                  {categories.map((item) => (
                    <option value={item.name} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label fw-semibold">
                  Level
                </label>

                <select
                  className="form-select"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <label className="form-label fw-semibold">
                  Price
                </label>

                <select
                  className="form-select"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                >
                  <option value="All">All Prices</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="col-lg-2">
                <label className="form-label fw-semibold">
                  Sort By
                </label>

                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Available Courses</h4>
            <p className="text-secondary mb-0">
              {filteredCourses.length} course(s) found
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearFilters}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Clear
            </button>

            <div className="btn-group">
              <button
                type="button"
                className={`btn ${
                  viewMode === "grid"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <i className="bi bi-grid"></i>
              </button>

              <button
                type="button"
                className={`btn ${
                  viewMode === "list"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <i className="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            ></div>
            <p className="text-secondary mt-3">Loading courses...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger text-center">
            <p className="mb-3">{error}</p>

            <button
              type="button"
              className="btn btn-danger"
              onClick={loadCourses}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center p-5">
              <i className="bi bi-search display-3 text-secondary"></i>
              <h3 className="fw-bold mt-3">No courses found</h3>
              <p className="text-secondary">
                Try changing or clearing your filters.
              </p>

              <button
                type="button"
                className="btn btn-primary-custom"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          filteredCourses.length > 0 &&
          (viewMode === "grid" ? (
            <div className="row g-4">
              {filteredCourses.map((course) => (
                <div
                  className="col-md-6 col-xl-4"
                  key={course.id}
                >
                  <CourseCard course={course} viewMode="grid" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filteredCourses.map((course) => (
                <CourseCard
                  course={course}
                  viewMode="list"
                  key={course.id}
                />
              ))}
            </div>
          ))}
      </div>
    </main>
  );
}

export default CoursesPage;