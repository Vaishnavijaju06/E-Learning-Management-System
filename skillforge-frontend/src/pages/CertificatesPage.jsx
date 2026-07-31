import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { certificateApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    certificateApi
      .mine()
      .then((response) => setCertificates(response.data))
      .catch((error) => setMessage(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  async function download(certificate) {
    try {
      const response = await certificateApi.download(
        certificate.serialNumber
      );
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `SkillForge-${certificate.serialNumber}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading certificates..." />;
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">My Certificates</h1>
      <AlertMessage>{message}</AlertMessage>

      {certificates.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-award"></i>
          <h2 className="h4">No certificates yet</h2>
          <p className="text-secondary mb-0">
            Complete a course and its quizzes to earn one.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {certificates.map((certificate) => (
            <div
              className="col-md-6"
              key={certificate.serialNumber}
            >
              <article className="certificate-card">
                <i className="bi bi-award-fill certificate-icon"></i>
                <div className="flex-grow-1">
                  <h2 className="h5 fw-bold">
                    {certificate.courseTitle}
                  </h2>
                  <p className="small text-secondary mb-3">
                    {certificate.serialNumber} · Issued{" "}
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString()}
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => download(certificate)}
                    >
                      Download PDF
                    </button>
                    <Link
                      className="btn btn-outline-secondary btn-sm"
                      to={`/verify-certificate/${certificate.serialNumber}`}
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
