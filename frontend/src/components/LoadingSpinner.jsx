export default function LoadingSpinner({
  message = "Loading..."
}) {
  return (
    <div className="skillforge-loader" role="status">
      <div className="loader-orbit">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-secondary mt-3 mb-0">
        {message}
      </p>
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
