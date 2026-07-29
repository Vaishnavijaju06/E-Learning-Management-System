import { instructorStudents } from "../data/instructorStudents";
import instructorCourseService from "./instructorCourseService";

const STORAGE_KEY = "skillforgeInstructorStudents";

const readStudents = () => {
  const storedStudents = localStorage.getItem(STORAGE_KEY);

  if (!storedStudents) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructorStudents));
    return instructorStudents;
  }

  try {
    const parsedStudents = JSON.parse(storedStudents);
    return Array.isArray(parsedStudents) ? parsedStudents : instructorStudents;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructorStudents));
    return instructorStudents;
  }
};

const instructorStudentService = {
  getStudents() {
    const courses = instructorCourseService.getCourses();

    return readStudents()
      .filter((student) =>
        courses.some((course) => course.id === student.courseId)
      )
      .map((student) => ({
        ...student,
        courseTitle:
          courses.find((course) => course.id === student.courseId)?.title ||
          "Unknown course",
      }));
  },

  getStudentById(studentId) {
    const student = this.getStudents().find(
      (item) => item.id === Number(studentId)
    );

    if (!student) {
      throw new Error("Student enrollment not found.");
    }

    return student;
  },
};

export default instructorStudentService;
