const ENROLLMENT_STORAGE_KEY = "skillforge-enrollments";

const readEnrollments = () => {
  try {
    return JSON.parse(
      localStorage.getItem(ENROLLMENT_STORAGE_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

export const isCourseEnrolled = (courseId) => {
  const enrollments = readEnrollments();

  return enrollments.some(
    (enrollment) =>
      String(enrollment.courseId) === String(courseId)
  );
};

export const createEnrollmentFromPayment = (payment) => {
  if (!payment || payment.status !== "PAID") {
    throw new Error(
      "A successful payment is required for enrollment"
    );
  }

  const enrollments = readEnrollments();

  const existingEnrollment = enrollments.find(
    (enrollment) =>
      String(enrollment.courseId) ===
      String(payment.courseId)
  );

  if (existingEnrollment) {
    return existingEnrollment;
  }

  const enrollment = {
    id: `enrollment_${Date.now()}`,
    courseId: payment.courseId,
    courseTitle: payment.courseTitle,
    paymentId: payment.id,
    status: "ENROLLED",
    progress: 0,
    enrolledAt: new Date().toISOString(),
  };

  localStorage.setItem(
    ENROLLMENT_STORAGE_KEY,
    JSON.stringify([enrollment, ...enrollments])
  );

  return enrollment;
};

export const getStoredEnrollments = () =>
  readEnrollments();