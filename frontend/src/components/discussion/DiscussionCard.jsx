import DiscussionReply from "./DiscussionReply";
import DiscussionStatusBadge from "./DiscussionStatusBadge";
import ReplyForm from "./ReplayForm";

export default function DiscussionCard({
  discussion,
  replyValue,
  onReplyChange,
  onReply,
  onResolve,
  onClose,
  working,
  role = "STUDENT"
}) {
  function formatDate(value) {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleString();
  }

  const replies = discussion.replies || [];
  const canReply = discussion.status !== "CLOSED";
  const showResolve =
    role === "STUDENT" && discussion.status === "OPEN";
  const showClose =
    role === "INSTRUCTOR" &&
    discussion.status !== "CLOSED";

  return (
    <article className="card discussion-card border-0">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div className="d-flex gap-3">
            <span className="discussion-avatar">
              {discussion.studentName
                ?.charAt(0)
                ?.toUpperCase() || "S"}
            </span>
            <div>
              <h3 className="h5 fw-bold mb-1">
                {discussion.title}
              </h3>
              <p className="small text-secondary mb-0">
                Asked by {discussion.studentName}
                {" • "}
                {formatDate(discussion.createdAt)}
              </p>
            </div>
          </div>

          <DiscussionStatusBadge status={discussion.status} />
        </div>

        <div className="discussion-question mt-4">
          <p className="mb-0">{discussion.message}</p>
        </div>

        <div className="d-flex align-items-center gap-2 my-4 text-secondary small">
          <i className="bi bi-chat-left-text"></i>
          <span>
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </span>
        </div>

        {replies.length === 0 ? (
          <div className="discussion-empty-replies">
            <i className="bi bi-chat-square-text"></i>
            <span>No replies yet. Start the conversation.</span>
          </div>
        ) : (
          <div className="d-grid gap-3 mb-4">
            {replies.map((reply) => (
              <DiscussionReply key={reply.id} reply={reply} />
            ))}
          </div>
        )}

        {canReply && (
          <ReplyForm
            value={replyValue}
            onChange={onReplyChange}
            onReply={onReply}
            working={working}
            showResolve={showResolve}
            onResolve={onResolve}
          />
        )}

        {showClose && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm mt-3"
            disabled={working}
            onClick={onClose}
          >
            <i className="bi bi-lock me-1"></i>
            Close Discussion
          </button>
        )}

        {discussion.status === "CLOSED" && (
          <div className="skillforge-alert alert alert-secondary d-flex gap-2 align-items-center mt-3 mb-0">
            <i className="bi bi-lock-fill"></i>
            <span>
              This discussion is closed. New replies are not allowed.
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
