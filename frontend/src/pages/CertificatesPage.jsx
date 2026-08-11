import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import { certificateApi } from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export default function CertificatesPage() {
  const toast = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    certificateApi
      .mine()
      .then((response) => setCertificates(response.data))
      .catch((error) => {
        const errorMessage = getErrorMessage(error);
        setMessage(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => setLoading(false));
  }, [toast]);

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
      toast.success("Certificate downloaded successfully.");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading certificates..." />;
  }

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <span className="section-eyebrow">
          Your achievements
        </span>
        <h1>My Certificates</h1>
        <p>
          Download your certificates or open the public
          verification page.
        </p>
      </div>

      <AlertMessage>{message}</AlertMessage>

      {certificates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-award"></i>
          </div>
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
              <article className="certificate-card h-100">
                <span className="certificate-icon">
                  <i className="bi bi-award-fill"></i>
                </span>
                <div className="flex-grow-1">
                  <span className="section-eyebrow">
                    Certificate of completion
                  </span>
                  <h2 className="h5 fw-bold mt-2">
                    {certificate.courseTitle}
                  </h2>
                  <p className="small text-secondary mb-3">
                    {certificate.serialNumber}
                    <br />
                    Issued{" "}
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
                      <i className="bi bi-download me-1"></i>
                      Download PDF
                    </button>
                    <Link
                      className="btn btn-outline-secondary btn-sm"
                      to={`/verify-certificate/${certificate.serialNumber}`}
                    >
                      <i className="bi bi-patch-check me-1"></i>
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
