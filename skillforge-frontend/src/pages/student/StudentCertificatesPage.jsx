import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  downloadCertificate,
  getStudentCertificates,
} from "../../services/certificateService";

function StudentCertificatesPage() {
  const navigate = useNavigate();
  const certificates = getStudentCertificates();

 const handleDownload = async (certificate) => {
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
      <div className="mb-4">
        <h1 className="fw-bold mb-1">My Certificates</h1>
        <p className="text-secondary mb-0">
          View and download certificates earned by completing courses.
        </p>
      </div>

      <div className="row g-4">
        {certificates.map((certificate) => (
          <div className="col-md-6 col-xl-4" key={certificate.id}>
            <section className="card certificate-card h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-4 d-flex flex-column">
                <div
                  className={`certificate-card-icon ${
                    certificate.certificateAvailable
                      ? "available"
                      : "locked"
                  }`}
                >
                  <i
                    className={`bi ${
                      certificate.certificateAvailable
                        ? "bi-award-fill"
                        : "bi-lock-fill"
                    }`}
                  ></i>
                </div>

                <span
                  className={`badge align-self-start mt-3 ${
                    certificate.certificateAvailable
                      ? "bg-success-subtle text-success"
                      : "bg-warning-subtle text-warning-emphasis"
                  }`}
                >
                  {certificate.certificateAvailable
                    ? "Certificate Available"
                    : "Not Yet Eligible"}
                </span>

                <h4 className="fw-bold mt-3">
                  {certificate.courseTitle}
                </h4>

                <p className="text-secondary small">
                  Instructor: {certificate.instructorName}
                </p>

                {certificate.certificateAvailable ? (
                  <>
                    <div className="certificate-information mb-4">
                      <p>
                        <span>Final score</span>
                        <strong>{certificate.score}%</strong>
                      </p>

                      <p>
                        <span>Issued on</span>
                        <strong>{certificate.issueDate}</strong>
                      </p>

                      <p>
                        <span>Certificate ID</span>
                        <strong>
                          {certificate.certificateNumber}
                        </strong>
                      </p>
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                      <button
                        type="button"
                        className="btn btn-outline-primary flex-grow-1"
                        onClick={() =>
                          navigate(
                            `/student/certificates/${certificate.certificateNumber}`
                          )
                        }
                      >
                        <i className="bi bi-eye me-2"></i>
                        View
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary-custom flex-grow-1"
                        onClick={() => handleDownload(certificate)}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 mb-3">
                      <div className="d-flex justify-content-between small mb-2">
                        <span>Course progress</span>
                        <strong>{certificate.progress || 0}%</strong>
                      </div>

                      <div
                        className="progress"
                        role="progressbar"
                        aria-valuenow={certificate.progress || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${certificate.progress || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="alert alert-warning small mt-auto mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      {certificate.requirement}
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        ))}
      </div>
    </main>
  );
}

export default StudentCertificatesPage;