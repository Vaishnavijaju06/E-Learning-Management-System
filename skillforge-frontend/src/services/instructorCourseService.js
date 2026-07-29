import { instructorCourses } from "../data/instructorCourses";

const STORAGE_KEY = "skillforgeInstructorCourses";

const readCourses = () => {
  const storedCourses = localStorage.getItem(STORAGE_KEY);

  if (!storedCourses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructorCourses));
    return instructorCourses;
  }

  try {
    const parsedCourses = JSON.parse(storedCourses);
    return Array.isArray(parsedCourses) ? parsedCourses : instructorCourses;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructorCourses));
    return instructorCourses;
  }
};

const saveCourses = (courses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

const instructorCourseService = {
  getCourses() {
    return readCourses();
  },

  updateStatus(courseId, status) {
    const courses = readCourses();
    const courseExists = courses.some((course) => course.id === courseId);

    if (!courseExists) {
      throw new Error("Course not found.");
    }

    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            status,
            updatedAt: new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }
        : course
    );

    saveCourses(updatedCourses);
    return updatedCourses;
  },

  deleteDraft(courseId) {
    const courses = readCourses();
    const selectedCourse = courses.find((course) => course.id === courseId);

    if (!selectedCourse) {
      throw new Error("Course not found.");
    }

    if (selectedCourse.status !== "DRAFT") {
      throw new Error("Unpublish this course before deleting it.");
    }

    const updatedCourses = courses.filter(
      (course) => course.id !== courseId
    );

    saveCourses(updatedCourses);
    return updatedCourses;
  },
};

export default instructorCourseService;
