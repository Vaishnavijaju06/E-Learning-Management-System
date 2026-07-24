const STORAGE_KEY = "skillforge-course-progress";

const getStoredProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export const getCompletedLessons = (courseId) => {
  const progress = getStoredProgress();
  return progress[courseId] || [];
};

export const isLessonCompleted = (courseId, lessonId) => {
  return getCompletedLessons(courseId).includes(Number(lessonId));
};

export const toggleLessonCompletion = (courseId, lessonId) => {
  const progress = getStoredProgress();
  const completedLessons = progress[courseId] || [];
  const numericLessonId = Number(lessonId);

  if (completedLessons.includes(numericLessonId)) {
    progress[courseId] = completedLessons.filter(
      (id) => id !== numericLessonId
    );
  } else {
    progress[courseId] = [...completedLessons, numericLessonId];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  return progress[courseId];
};

export const calculateCourseProgress = (courseId, totalLessons) => {
  if (!totalLessons) {
    return 0;
  }

  const completedCount = getCompletedLessons(courseId).length;

  return Math.round((completedCount / totalLessons) * 100);
};