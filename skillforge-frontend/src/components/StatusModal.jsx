export default function StatusModal({
  type = "success",
  title,
  message,
  confirmLabel = "OK",
  onClose
}) {
  const isSuccess = type === "success";

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow text-center">
            <div className="modal-body p-4 p-lg-5">
              <div
                className={`status-modal-icon mx-auto mb-4 ${
                  isSuccess
                    ? "status-modal-icon-success"
                    : "status-modal-icon-error"
                }`}
              >
                <i
                  className={`bi ${
                    isSuccess
                      ? "bi-check-lg"
                      : "bi-x-lg"
                  }`}
                ></i>
              </div>

              <h2
                id="status-modal-title"
                className="h4 fw-bold mb-2"
              >
                {title}
              </h2>

              <p className="text-secondary mb-4">
                {message}
              </p>

              <button
                type="button"
                className={`btn w-100 py-2 ${
                  isSuccess
                    ? "btn-primary"
                    : "btn-outline-danger"
                }`}
                onClick={onClose}
                autoFocus
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}