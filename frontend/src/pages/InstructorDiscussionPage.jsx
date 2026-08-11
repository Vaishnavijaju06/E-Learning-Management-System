import { useEffect, useMemo, useState } from "react";

import discussionApi from "../api/discussionApi";
import { courseApi } from "../api/skillforgeApi";
import DiscussionCard from "../components/discussion/DiscussionCard";
import DiscussionFilter from "../components/discussion/DiscussionFilter";
import { useToast } from "../context/ToastContext";

export default function InstructorDiscussionPage() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] =
    useState("");

  const [discussions, setDiscussions] = useState([]);
  const [replyText, setReplyText] = useState({});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInstructorCourses();
  }, []);

  useEffect(() => {
    setSearch("");
    setStatus("ALL");
    setSuccess("");

    if (selectedCourseId) {
      loadDiscussions(selectedCourseId);
    } else {
      setDiscussions([]);
    }
  }, [selectedCourseId]);

  const filteredDiscussions = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return discussions.filter((discussion) => {
      const titleText =
        discussion.title?.toLowerCase() || "";

      const messageText =
        discussion.message?.toLowerCase() || "";

      const studentText =
        discussion.studentName?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        titleText.includes(normalizedSearch) ||
        messageText.includes(normalizedSearch) ||
        studentText.includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" ||
        discussion.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [discussions, search, status]);

  async function loadInstructorCourses() {
  try {
    setError("");

    const response =
      await courseApi.instructorList();

    const courseList = Array.isArray(response.data)
      ? response.data
      : [];

    setCourses(courseList);

    if (courseList.length > 0) {
      setSelectedCourseId(
        String(courseList[0].id)
      );
    }
  } catch (err) {
    console.error(
      "Unable to load instructor courses:",
      err
    );

    const message =
      err.response?.data?.message ||
      "Unable to load instructor courses";
    setError(message);
    toast.error(message);
  }
}

  async function loadDiscussions(courseId) {
    try {
      setLoading(true);
      setError("");

      const response =
        await discussionApi.getCourseDiscussions(
          courseId
        );

      setDiscussions(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load discussions";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReply(discussionId) {
    const reply = replyText[discussionId];

    if (!reply?.trim()) {
      return;
    }

    try {
      setWorking(true);
      setError("");
      setSuccess("");

      await discussionApi.addReply(
        discussionId,
        {
          message: reply.trim()
        }
      );

      setReplyText((current) => ({
        ...current,
        [discussionId]: ""
      }));

      const successMessage = "Reply added successfully";
      setSuccess(successMessage);
      toast.success(successMessage);

      await loadDiscussions(selectedCourseId);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to add reply";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  async function handleClose(discussionId) {
    try {
      setWorking(true);
      setError("");
      setSuccess("");

      await discussionApi.close(discussionId);

      const successMessage =
        "Discussion closed successfully";
      setSuccess(successMessage);
      toast.success(successMessage);

      await loadDiscussions(selectedCourseId);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to close discussion";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  const totalCount = discussions.length;

  const openCount = discussions.filter(
    (discussion) =>
      discussion.status === "OPEN"
  ).length;

  const resolvedCount = discussions.filter(
    (discussion) =>
      discussion.status === "RESOLVED"
  ).length;

  const closedCount = discussions.filter(
    (discussion) =>
      discussion.status === "CLOSED"
  ).length;

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <h2 className="fw-bold">
          Student Discussions
        </h2>

        <p className="text-secondary mb-0">
          View and answer questions from students
          enrolled in your courses.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label fw-semibold">
            Select Course
          </label>

          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(event) =>
              setSelectedCourseId(
                event.target.value
              )
            }
          >
            <option value="">
              Select your course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCourseId && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-1">
                    Total
                  </p>

                  <h3 className="mb-0">
                    {totalCount}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-1">
                    Open
                  </p>

                  <h3 className="mb-0 text-success">
                    {openCount}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-1">
                    Resolved
                  </p>

                  <h3 className="mb-0 text-primary">
                    {resolvedCount}
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-secondary mb-1">
                    Closed
                  </p>

                  <h3 className="mb-0">
                    {closedCount}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <DiscussionFilter
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />
        </>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">
            Course Discussions
          </h4>

          <small className="text-secondary">
            Showing {filteredDiscussions.length} of{" "}
            {discussions.length}
          </small>
        </div>

        <span className="badge bg-secondary">
          {filteredDiscussions.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          ></div>
        </div>
      ) : discussions.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-chat-left-text fs-1 text-secondary"></i>

            <h5 className="mt-3">
              No student discussions
            </h5>

            <p className="text-secondary mb-0">
              Student questions for the selected
              course will appear here.
            </p>
          </div>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-search fs-1 text-secondary"></i>

            <h5 className="mt-3">
              No matching discussions
            </h5>

            <p className="text-secondary mb-3">
              Try another search term or status.
            </p>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setSearch("");
                setStatus("ALL");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="d-grid gap-3">
          {filteredDiscussions.map(
            (discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                role="INSTRUCTOR"
                working={working}
                replyValue={
                  replyText[discussion.id] || ""
                }
                onReplyChange={(value) =>
                  setReplyText((current) => ({
                    ...current,
                    [discussion.id]: value
                  }))
                }
                onReply={() =>
                  handleReply(discussion.id)
                }
                onClose={() =>
                  handleClose(discussion.id)
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}