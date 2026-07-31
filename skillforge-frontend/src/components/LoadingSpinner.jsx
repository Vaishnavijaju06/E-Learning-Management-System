export default function LoadingSpinner({
  message = "Loading..."
}) {
  return (
    <div className="text-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
      >
        <span className="visually-hidden">Loading</span>
      </div>
      <p className="text-secondary mt-3 mb-0">
        {message}
      </p>
    </div>
  );
}
