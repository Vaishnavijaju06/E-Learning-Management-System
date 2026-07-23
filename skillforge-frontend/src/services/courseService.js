import { courses } from "../data/courses";

const delay = (milliseconds = 300) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const courseService = {
  async getAllCourses() {
    await delay();
    return [...courses];
  },

  async getCourseById(courseId) {
    await delay();

    const course = courses.find(
      (item) => item.id === Number(courseId)
    );

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  },

  async getFeaturedCourses() {
    await delay();

    return courses.filter((course) => course.featured);
  },

  async searchCourses(searchText) {
    await delay();

    const searchValue = searchText.trim().toLowerCase();

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchValue) ||
        course.category.toLowerCase().includes(searchValue) ||
        course.instructor.toLowerCase().includes(searchValue)
    );
  },
};

export default courseService;