export default function ReplyForm({
  value,
  onChange,
  onReply,
  working,
  showResolve,
  onResolve
}) {
  return (
    <div className="discussion-reply-form">
      <label className="form-label">Add a reply</label>
      <textarea
        className="form-control mb-3"
        rows="3"
        value={value}
        placeholder="Write a clear and helpful reply..."
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="d-flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={working || !value?.trim()}
          onClick={onReply}
        >
          <i className="bi bi-send me-1"></i>
          Reply
        </button>

        {showResolve && (
          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            disabled={working}
            onClick={onResolve}
          >
            <i className="bi bi-check-circle me-1"></i>
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
}
