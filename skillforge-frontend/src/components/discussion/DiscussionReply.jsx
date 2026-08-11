export default function DiscussionReply({ reply }) {
  const isInstructor = reply.authorRole === "INSTRUCTOR";
  const isAdmin = reply.authorRole === "ADMIN";

  return (
    <div
      className={`discussion-reply ${
        isInstructor ? "instructor-reply" : ""
      }`}
    >
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="reply-avatar">
            {reply.authorName?.charAt(0)?.toUpperCase() || "U"}
          </span>
          <div>
            <strong className="d-block small">
              {reply.authorName}
            </strong>
            <span className="small text-secondary">
              {isInstructor
                ? "Instructor"
                : isAdmin
                ? "Administrator"
                : "Student"}
            </span>
          </div>
        </div>

        <small className="text-muted">
          {new Date(reply.createdAt).toLocaleString()}
        </small>
      </div>

      <p className="mb-0 mt-3">{reply.message}</p>
    </div>
  );
}
