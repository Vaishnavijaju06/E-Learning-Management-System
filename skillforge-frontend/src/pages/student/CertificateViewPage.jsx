import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  downloadCertificate,
  getCertificate,
} from "../../services/certificateService";

function CertificateViewPage() {
  const { certificateNumber } = useParams();
  const navigate = useNavigate();

  const certificate = getCertificate(certificateNumber);

  if (!certificate || !certificate.certificateAvailable) {
    return <Navigate to="/student/certificates" replace />;
  }

 const handleDownload = async () => {
  try {
    await downloadCertificate(certificate);
    toast.success("Certificate PDF downloaded successfully");
  } catch (error) {
    toast.error(
      error.message || "Unable to download certificate"
    );
  }
};

  return (
    <main className="container-fluid p-3 p-md-4">
      <div className="d-flex justify-content-between gap-3 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/student/certificates")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>

        <button
          type="button"
          className="btn btn-primary-custom"
          onClick={handleDownload}
        >
          <i className="bi bi-download me-2"></i>
          Download
        </button>
      </div>

      <section className="certificate-document shadow-lg">
        <div className="certificate-border">
          <div className="certificate-logo">
            <i className="bi bi-mortarboard-fill"></i>
            <span>SkillForge</span>
          </div>

          <p className="certificate-label">
            Certificate of Completion
          </p>

          <p className="certificate-presentation">
            This certificate is proudly presented to
          </p>

          <h1>{certificate.studentName}</h1>

          <p className="certificate-presentation">
            for successfully completing the course
          </p>

          <h2>{certificate.courseTitle}</h2>

          <p className="certificate-description">
            The recipient demonstrated dedication and successfully
            fulfilled all course requirements with a final score of{" "}
            <strong>{certificate.score}%</strong>.
          </p>

          <div className="certificate-signatures">
            <div>
              <strong>{certificate.instructorName}</strong>
              <span>Course Instructor</span>
            </div>

            <div className="certificate-seal">
              <i className="bi bi-award-fill"></i>
            </div>

            <div>
              <strong>{certificate.issueDate}</strong>
              <span>Date Issued</span>
            </div>
          </div>

          <div className="certificate-footer">
            <span>ID: {certificate.certificateNumber}</span>
            <span>Verify at SkillForge</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CertificateViewPage;