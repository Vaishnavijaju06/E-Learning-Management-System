import { instructorReviews } from "../data/instructorReviews";
import instructorCourseService from "./instructorCourseService";

const REVIEWS_KEY = "skillforgeInstructorReviews";

const readReviews = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Restore demo data below.
  }

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(instructorReviews));
  return instructorReviews;
};

const saveReviews = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

const withCourse = (review) => ({
  ...review,
  courseTitle:
    instructorCourseService
      .getCourses()
      .find((course) => course.id === review.courseId)?.title ||
    "Unknown course",
});

const findReviewIndex = (reviews, reviewId) => {
  const index = reviews.findIndex(
    (review) => review.id === Number(reviewId)
  );
  if (index < 0) throw new Error("Review not found.");
  return index;
};

const instructorReviewService = {
  getReviews() {
    return readReviews()
      .map(withCourse)
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
      );
  },

  saveResponse(reviewId, response) {
    const normalizedResponse = response.trim();
    if (normalizedResponse.length < 10) {
      throw new Error("Response must contain at least 10 characters.");
    }

    const reviews = readReviews();
    const index = findReviewIndex(reviews, reviewId);
    reviews[index] = {
      ...reviews[index],
      response: normalizedResponse,
      respondedAt: new Date().toISOString(),
    };
    saveReviews(reviews);
    return withCourse(reviews[index]);
  },

  reportReview(reviewId, reason) {
    const normalizedReason = reason.trim();
    if (normalizedReason.length < 5) {
      throw new Error("Select or enter a valid report reason.");
    }

    const reviews = readReviews();
    const index = findReviewIndex(reviews, reviewId);
    reviews[index] = {
      ...reviews[index],
      reported: true,
      reportReason: normalizedReason,
    };
    saveReviews(reviews);
    return withCourse(reviews[index]);
  },

  removeReport(reviewId) {
    const reviews = readReviews();
    const index = findReviewIndex(reviews, reviewId);
    reviews[index] = {
      ...reviews[index],
      reported: false,
      reportReason: "",
    };
    saveReviews(reviews);
    return withCourse(reviews[index]);
  },
};

export default instructorReviewService;
