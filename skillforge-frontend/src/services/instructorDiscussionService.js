import { instructorDiscussions } from "../data/instructorDiscussions";
import instructorCourseService from "./instructorCourseService";

const DISCUSSIONS_KEY = "skillforgeInstructorDiscussions";

const readDiscussions = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(DISCUSSIONS_KEY));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Restore demo data below.
  }

  localStorage.setItem(
    DISCUSSIONS_KEY,
    JSON.stringify(instructorDiscussions)
  );
  return instructorDiscussions;
};

const saveDiscussions = (discussions) => {
  localStorage.setItem(DISCUSSIONS_KEY, JSON.stringify(discussions));
};

const withCourse = (discussion) => ({
  ...discussion,
  courseTitle:
    instructorCourseService
      .getCourses()
      .find((course) => course.id === discussion.courseId)?.title ||
    "Unknown course",
});

const instructorDiscussionService = {
  getDiscussions() {
    return readDiscussions()
      .map(withCourse)
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
      );
  },

  getDiscussionById(discussionId) {
    const discussion = readDiscussions().find(
      (item) => item.id === Number(discussionId)
    );
    if (!discussion) throw new Error("Discussion not found.");
    return withCourse(discussion);
  },

  saveReply(discussionId, reply) {
    const normalizedReply = reply.trim();
    if (normalizedReply.length < 10) {
      throw new Error("Reply must contain at least 10 characters.");
    }

    const discussions = readDiscussions();
    const index = discussions.findIndex(
      (item) => item.id === Number(discussionId)
    );
    if (index < 0) throw new Error("Discussion not found.");

    discussions[index] = {
      ...discussions[index],
      reply: normalizedReply,
      repliedAt: new Date().toISOString(),
    };
    saveDiscussions(discussions);
    return withCourse(discussions[index]);
  },

  updateStatus(discussionId, status) {
    if (!["OPEN", "RESOLVED"].includes(status)) {
      throw new Error("Invalid discussion status.");
    }

    const discussions = readDiscussions();
    const index = discussions.findIndex(
      (item) => item.id === Number(discussionId)
    );
    if (index < 0) throw new Error("Discussion not found.");
    if (status === "RESOLVED" && !discussions[index].reply.trim()) {
      throw new Error("Reply to the student before resolving the discussion.");
    }

    discussions[index] = { ...discussions[index], status };
    saveDiscussions(discussions);
    return withCourse(discussions[index]);
  },
};

export default instructorDiscussionService;
