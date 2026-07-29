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

const formatUpdatedDate = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const instructorCourseService = {
  getCourses() {
    return readCourses();
  },

  getCourseById(courseId) {
    const numericCourseId = Number(courseId);
    const course = readCourses().find(
      (item) => item.id === numericCourseId
    );

    if (!course) {
      throw new Error("Course not found.");
    }

    return course;
  },

  createCourse(courseData, status = "DRAFT") {
    const courses = readCourses();
    const nextId =
      courses.length > 0
        ? Math.max(...courses.map((course) => course.id)) + 1
        : 101;

    const newCourse = {
      id: nextId,
      ...courseData,
      price: Number(courseData.price),
      status,
      students: 0,
      lessons: 0,
      rating: 0,
      updatedAt: formatUpdatedDate(),
      icon: courseData.icon || "bi-journal-richtext",
      color: courseData.color || "primary",
    };

    saveCourses([newCourse, ...courses]);
    return newCourse;
  },

  updateCourse(courseId, courseData, status) {
    const numericCourseId = Number(courseId);
    const courses = readCourses();
    const selectedCourse = courses.find(
      (course) => course.id === numericCourseId
    );

    if (!selectedCourse) {
      throw new Error("Course not found.");
    }

    const updatedCourse = {
      ...selectedCourse,
      ...courseData,
      price: Number(courseData.price),
      status: status || selectedCourse.status,
      updatedAt: formatUpdatedDate(),
    };

    saveCourses(
      courses.map((course) =>
        course.id === numericCourseId ? updatedCourse : course
      )
    );

    return updatedCourse;
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
            updatedAt: formatUpdatedDate(),
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
