import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { studentCourses } from "../../data/studentCourses";
import {
  calculateCourseProgress,
  getCompletedLessons,
  toggleLessonCompletion,
} from "../../services/courseProgressService";

function CourseLearningPage() {
  const { courseId } = useParams();

  const course = studentCourses.find(
    (item) => item.id === Number(courseId)
  );

  const allLessons = useMemo(
    () =>
      course
        ? course.modules.flatMap((module) => module.lessons)
        : [],
    [course]
  );

  const [selectedLessonId, setSelectedLessonId] = useState(
    allLessons[0]?.id
  );

  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    if (course) {
      setCompletedLessons(getCompletedLessons(course.id));
    }
  }, [course]);

  if (!course) {
    return (
      <main className="container-fluid p-4">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-5 text-center">
            <i className="bi bi-exclamation-circle display-3 text-danger"></i>
            <h2 className="fw-bold mt-3">Course Not Found</h2>
            <Link
              to="/student/courses"
              className="btn btn-primary-custom mt-3"
            >
              Return to My Courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedLesson =
    allLessons.find(
      (lesson) => lesson.id === Number(selectedLessonId)
    ) || allLessons[0];

  const progress = calculateCourseProgress(
    course.id,
    course.totalLessons
  );

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson.id
  );

  const handleCompletion = () => {
    const updatedLessons = toggleLessonCompletion(
      course.id,
      selectedLesson.id
    );

    setCompletedLessons(updatedLessons);

    const lessonWasCompleted = updatedLessons.includes(
      selectedLesson.id
    );

    toast.success(
      lessonWasCompleted
        ? "Lesson marked as completed"
        : "Lesson marked as incomplete"
    );
  };

  const selectNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setSelectedLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="mb-4">
        <Link
          to="/student/courses"
          className="text-decoration-none"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to My Courses
        </Link>

        <h1 className="fw-bold mt-3">{course.title}</h1>

        <div className="d-flex align-items-center gap-3">
          <div className="progress flex-grow-1 student-course-progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <span className="fw-bold text-primary">{progress}%</span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <section className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-3 p-md-4">
              {selectedLesson.type === "VIDEO" ? (
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden bg-dark">
                  <iframe
                    src={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="lesson-reading-content">
                  <i className="bi bi-file-earmark-text display-3 text-primary"></i>
                  <h3 className="fw-bold mt-3">Reading Lesson</h3>
                  <p className="text-secondary">
                    Read the lesson explanation below and mark it as
                    complete afterward.
                  </p>
                </div>
              )}

              <div className="mt-4">
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    <span className="badge bg-primary-subtle text-primary mb-2">
                      {selectedLesson.type}
                    </span>

                    <h2 className="fw-bold">
                      {selectedLesson.title}
                    </h2>
                  </div>

                  <span className="text-secondary">
                    <i className="bi bi-clock me-2"></i>
                    {selectedLesson.duration}
                  </span>
                </div>

                <p className="text-secondary">
                  {selectedLesson.content}
                </p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    className={
                      completedLessons.includes(selectedLesson.id)
                        ? "btn btn-outline-success"
                        : "btn btn-success"
                    }
                    onClick={handleCompletion}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {completedLessons.includes(selectedLesson.id)
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary-custom"
                    onClick={selectNextLesson}
                    disabled={
                      currentLessonIndex === allLessons.length - 1
                    }
                  >
                    Next Lesson
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-xl-4">
          <aside className="card border-0 shadow-sm rounded-4 course-curriculum">
            <div className="card-body p-0">
              <div className="p-4 border-bottom">
                <h4 className="fw-bold mb-1">Course Content</h4>
                <small className="text-secondary">
                  {completedLessons.length} of {course.totalLessons}{" "}
                  lessons completed
                </small>
              </div>

              <div className="accordion accordion-flush">
                {course.modules.map((module, moduleIndex) => (
                  <div
                    className="accordion-item"
                    key={module.id}
                  >
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${
                          moduleIndex === 0 ? "" : "collapsed"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#module-${module.id}`}
                      >
                        {module.title}
                      </button>
                    </h2>

                    <div
                      id={`module-${module.id}`}
                      className={`accordion-collapse collapse ${
                        moduleIndex === 0 ? "show" : ""
                      }`}
                    >
                      <div className="accordion-body p-2">
                        {module.lessons.map((lesson) => {
                          const completed =
                            completedLessons.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              className={`lesson-navigation-item ${
                                selectedLesson.id === lesson.id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                setSelectedLessonId(lesson.id)
                              }
                            >
                              <i
                                className={`bi ${
                                  completed
                                    ? "bi-check-circle-fill text-success"
                                    : lesson.type === "VIDEO"
                                    ? "bi-play-circle"
                                    : "bi-file-text"
                                }`}
                              ></i>

                              <span className="flex-grow-1 text-start">
                                <span className="d-block fw-semibold">
                                  {lesson.title}
                                </span>

                                <small>{lesson.duration}</small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CourseLearningPage;