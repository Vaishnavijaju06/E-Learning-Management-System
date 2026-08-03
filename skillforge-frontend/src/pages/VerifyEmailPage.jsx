import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

function VerifyEmailPage() {

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const hasVerified = useRef(false);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {

    // Prevent duplicate API call in React StrictMode
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Verification token is missing.");
      return;
    }

    axios
      .get(
        `http://localhost:8081/api/auth/verify-email?token=${token}`
      )
      .then((response) => {

        setSuccess(true);
        setMessage(response.data);

      })
      .catch((error) => {

        setSuccess(false);

        if (error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Email verification failed.");
        }

      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);

  return (
    <div className="container py-5">

      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "550px" }}
      >

        <div className="card-body text-center">

          {loading && (
            <>
              <div
                className="spinner-border text-primary mb-3"
                role="status"
              ></div>

              <h3>Verifying your email...</h3>
            </>
          )}

          {!loading && success && (
            <>
              <div className="display-3 text-success mb-3">
                ✅
              </div>

              <h3>Email Verified</h3>

              <p>{message}</p>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Go to Login
              </Link>
            </>
          )}

          {!loading && !success && (
            <>
              <div className="display-3 text-danger mb-3">
                ❌
              </div>

              <h3>Verification Failed</h3>

              <p>{message}</p>

              <Link
                to="/login"
                className="btn btn-secondary"
              >
                Back to Login
              </Link>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default VerifyEmailPage;