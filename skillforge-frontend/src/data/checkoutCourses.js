export const checkoutCourses = [
  {
    id: 1,
    title: "Complete Java and Spring Boot Masterclass",
    instructorName: "Rahul Sharma",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    originalPrice: 4999,
    sellingPrice: 1999,
    duration: "42 hours",
    lessons: 128,
    level: "Intermediate",
  },
  {
    id: 2,
    title: "React Frontend Development",
    instructorName: "Priya Mehta",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    originalPrice: 3999,
    sellingPrice: 1499,
    duration: "30 hours",
    lessons: 96,
    level: "Beginner",
  },
];

export const getCheckoutCourseById = (courseId) =>
  checkoutCourses.find(
    (course) => String(course.id) === String(courseId)
  );