import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import discussionApi from "../api/discussionApi";
import { enrollmentApi } from "../api/skillforgeApi";
import DiscussionCard from "../components/discussion/DiscussionCard";
import DiscussionFilter from "../components/discussion/DiscussionFilter";
import { useToast } from "../context/ToastContext";

export default function StudentDiscussionPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] =
    useState("");

  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState({});

  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadMyCourses();
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

  async function loadMyCourses() {
    try {
      setError("");

      const response = await enrollmentApi.mine();

      const enrollmentList = Array.isArray(response.data)
        ? response.data
        : [];

      const enrolledCourses = enrollmentList.map(
        (enrollment) => ({
          id: enrollment.courseId,
          title: enrollment.courseTitle,
          thumbnailUrl: enrollment.thumbnailUrl,
          status: enrollment.status,
          progressPercent:
            enrollment.progressPercent
        })
      );

      setCourses(enrolledCourses);

      const courseFromUrl =
        searchParams.get("courseId");

      const courseExists = enrolledCourses.some(
        (course) =>
          String(course.id) ===
          String(courseFromUrl)
      );

      if (courseFromUrl && courseExists) {
        setSelectedCourseId(
          String(courseFromUrl)
        );
      } else if (enrolledCourses.length > 0) {
        setSelectedCourseId(
          String(enrolledCourses[0].id)
        );
      }
    } catch (err) {
      console.error(
        "Unable to load enrolled courses:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to load enrolled courses";
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

  async function handleCreateDiscussion(event) {
    event.preventDefault();

    if (!selectedCourseId) {
      const message = "Please select a course";
      setError(message);
      toast.warning(message);
      return;
    }

    try {
      setWorking(true);
      setError("");
      setSuccess("");

      await discussionApi.create({
        courseId: Number(selectedCourseId),
        title: title.trim(),
        message: message.trim()
      });

      setTitle("");
      setMessage("");
      const successMessage =
        "Discussion posted successfully";
      setSuccess(successMessage);
      toast.success(successMessage);

      await loadDiscussions(selectedCourseId);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create discussion";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
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

  async function handleResolve(discussionId) {
    try {
      setWorking(true);
      setError("");
      setSuccess("");

      await discussionApi.resolve(discussionId);

      const successMessage =
        "Discussion marked as resolved";
      setSuccess(successMessage);
      toast.success(successMessage);

      await loadDiscussions(selectedCourseId);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to resolve discussion";
      setError(message);
      toast.error(message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <h2 className="fw-bold">
          Course Discussions
        </h2>

        <p className="text-secondary mb-0">
          Ask questions and communicate with your
          instructor.
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
              Select enrolled course
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
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              Ask a Question
            </h5>
          </div>

          <div className="card-body">
            <form
              onSubmit={handleCreateDiscussion}
            >
              <div className="mb-3">
                <label className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={title}
                  maxLength={200}
                  required
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter discussion title"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Question
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  maxLength={2000}
                  required
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder="Describe your doubt clearly"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={working}
              >
                {working
                  ? "Posting..."
                  : "Post Question"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedCourseId && (
        <DiscussionFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">
            Discussions
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
              No discussions yet
            </h5>

            <p className="text-secondary mb-0">
              Be the first student to ask a
              question for this course.
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
                role="STUDENT"
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
                onResolve={() =>
                  handleResolve(discussion.id)
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}