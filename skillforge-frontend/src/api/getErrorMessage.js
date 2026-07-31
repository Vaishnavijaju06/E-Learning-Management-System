export default function getErrorMessage(
  error,
  fallback = "Something went wrong"
) {
  const data = error.response?.data;

  if (data?.validationErrors) {
    return Object.values(data.validationErrors).join(", ");
  }

  return data?.message || data?.detail || fallback;
}
