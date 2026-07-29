import {
  instructorAssignments,
  instructorAssignmentSubmissions,
} from "../data/instructorAssignments";
import instructorCourseService from "./instructorCourseService";
import instructorStudentService from "./instructorStudentService";

const ASSIGNMENTS_KEY = "skillforgeInstructorAssignments";
const SUBMISSIONS_KEY = "skillforgeInstructorAssignmentSubmissions";

const readCollection = (key, initialValue) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(stored)) return stored;
  } catch {
    // Restore demo data below.
  }
  localStorage.setItem(key, JSON.stringify(initialValue));
  return initialValue;
};

const saveCollection = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const withCourse = (assignment) => {
  const submissions = readCollection(
    SUBMISSIONS_KEY,
    instructorAssignmentSubmissions
  ).filter((item) => item.assignmentId === assignment.id);

  return {
    ...assignment,
    courseTitle:
      instructorCourseService
        .getCourses()
        .find((course) => course.id === assignment.courseId)?.title ||
      "Unknown course",
    submissionCount: submissions.length,
    gradedCount: submissions.filter((item) => item.status === "GRADED").length,
  };
};

const instructorAssignmentService = {
  getAssignments() {
    return readCollection(ASSIGNMENTS_KEY, instructorAssignments).map(
      withCourse
    );
  },

  getAssignmentById(assignmentId) {
    const assignment = readCollection(
      ASSIGNMENTS_KEY,
      instructorAssignments
    ).find((item) => item.id === Number(assignmentId));
    if (!assignment) throw new Error("Assignment not found.");
    return withCourse(assignment);
  },

  saveAssignment(assignmentData) {
    const assignments = readCollection(
      ASSIGNMENTS_KEY,
      instructorAssignments
    );
    const normalized = {
      ...assignmentData,
      courseId: Number(assignmentData.courseId),
      totalMarks: Number(assignmentData.totalMarks),
      resourceUrl: assignmentData.resourceUrl.trim(),
      createdAt: assignmentData.createdAt || new Date().toISOString().slice(0, 10),
    };

    if (assignmentData.id) {
      const index = assignments.findIndex(
        (item) => item.id === Number(assignmentData.id)
      );
      if (index < 0) throw new Error("Assignment not found.");
      assignments[index] = { ...normalized, id: Number(assignmentData.id) };
    } else {
      normalized.id =
        Math.max(400, ...assignments.map((item) => item.id)) + 1;
      assignments.push(normalized);
    }

    saveCollection(ASSIGNMENTS_KEY, assignments);
    return normalized;
  },

  updateStatus(assignmentId, status) {
    const assignment = this.getAssignmentById(assignmentId);
    return this.saveAssignment({ ...assignment, status });
  },

  deleteAssignment(assignmentId) {
    const assignment = this.getAssignmentById(assignmentId);
    if (assignment.status !== "DRAFT") {
      throw new Error("Unpublish the assignment before deleting it.");
    }
    saveCollection(
      ASSIGNMENTS_KEY,
      readCollection(ASSIGNMENTS_KEY, instructorAssignments).filter(
        (item) => item.id !== Number(assignmentId)
      )
    );
  },

  getSubmissions(assignmentId) {
    const students = instructorStudentService.getStudents();
    return readCollection(
      SUBMISSIONS_KEY,
      instructorAssignmentSubmissions
    )
      .filter((item) => item.assignmentId === Number(assignmentId))
      .map((submission) => ({
        ...submission,
        student:
          students.find((student) => student.id === submission.studentId) || {
            name: "Unknown student",
            email: "",
          },
      }));
  },

  gradeSubmission(submissionId, marks, feedback) {
    const submissions = readCollection(
      SUBMISSIONS_KEY,
      instructorAssignmentSubmissions
    );
    const index = submissions.findIndex(
      (item) => item.id === Number(submissionId)
    );
    if (index < 0) throw new Error("Submission not found.");

    submissions[index] = {
      ...submissions[index],
      marks: Number(marks),
      feedback: feedback.trim(),
      status: "GRADED",
      gradedAt: new Date().toISOString(),
    };
    saveCollection(SUBMISSIONS_KEY, submissions);
    return submissions[index];
  },
};

export default instructorAssignmentService;
