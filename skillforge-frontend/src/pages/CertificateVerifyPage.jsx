import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { certificateApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CertificateVerifyPage() {
  const { serialNumber } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    certificateApi
      .verify(serialNumber)
      .then((response) => setCertificate(response.data))
      .catch((requestError) =>
        setError(
          getErrorMessage(
            requestError,
            "This certificate could not be verified."
          )
        )
      )
      .finally(() => setLoading(false));
  }, [serialNumber]);

  if (loading) {
    return <LoadingSpinner message="Verifying certificate..." />;
  }

  return (
    <div className="container py-5">
      <div className="verify-panel mx-auto">
        {certificate ? (
          <>
            <div className="verify-check">
              <i className="bi bi-patch-check-fill"></i>
            </div>
            <p className="text-success fw-semibold">
              VERIFIED CERTIFICATE
            </p>
            <h1 className="h2 fw-bold">
              {certificate.courseTitle}
            </h1>
            <p className="lead">
              Awarded to{" "}
              <strong>{certificate.studentName}</strong>
            </p>
            <dl className="row text-start bg-light rounded-4 p-3 mt-4 mb-0">
              <dt className="col-sm-5">Certificate number</dt>
              <dd className="col-sm-7">
                {certificate.serialNumber}
              </dd>
              <dt className="col-sm-5">Issued</dt>
              <dd className="col-sm-7 mb-0">
                {new Date(
                  certificate.issuedAt
                ).toLocaleDateString()}
              </dd>
            </dl>
          </>
        ) : (
          <>
            <div className="verify-check invalid">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <h1 className="h3 fw-bold">
              Certificate Not Verified
            </h1>
            <AlertMessage>{error}</AlertMessage>
          </>
        )}
      </div>
    </div>
  );
}
