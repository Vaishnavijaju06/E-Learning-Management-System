export default function getErrorMessage(
  error,
  fallback = "Something went wrong"
) {
  const data = error.response?.data;

  if (
    data?.validationErrors &&
    Object.keys(data.validationErrors).length > 0
  ) {
    return Object.values(data.validationErrors).join(", ");
  }

  return data?.message || data?.detail || fallback;
}