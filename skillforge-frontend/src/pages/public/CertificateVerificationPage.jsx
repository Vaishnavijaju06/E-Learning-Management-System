import { Link, useParams } from "react-router-dom";

import { getCertificate } from "../../services/certificateService";

function CertificateVerificationPage() {
  const { certificateNumber } = useParams();
  const certificate = getCertificate(certificateNumber);

  const isValid =
    certificate && certificate.certificateAvailable;

  return (
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <section className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5 text-center">
                {isValid ? (
                  <>
                    <div className="certificate-verification-icon valid">
                      <i className="bi bi-patch-check-fill"></i>
                    </div>

                    <h1 className="fw-bold mt-4">
                      Certificate Verified
                    </h1>

                    <p className="text-secondary">
                      This is a valid certificate issued by
                      SkillForge.
                    </p>

                    <div className="certificate-verification-details text-start mt-4">
                      <p>
                        <span>Student</span>
                        <strong>{certificate.studentName}</strong>
                      </p>

                      <p>
                        <span>Course</span>
                        <strong>{certificate.courseTitle}</strong>
                      </p>

                      <p>
                        <span>Instructor</span>
                        <strong>
                          {certificate.instructorName}
                        </strong>
                      </p>

                      <p>
                        <span>Final score</span>
                        <strong>{certificate.score}%</strong>
                      </p>

                      <p>
                        <span>Issue date</span>
                        <strong>{certificate.issueDate}</strong>
                      </p>

                      <p>
                        <span>Certificate ID</span>
                        <strong>
                          {certificate.certificateNumber}
                        </strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="certificate-verification-icon invalid">
                      <i className="bi bi-x-circle-fill"></i>
                    </div>

                    <h1 className="fw-bold mt-4">
                      Certificate Not Found
                    </h1>

                    <p className="text-secondary">
                      This certificate number is invalid or has
                      not been issued.
                    </p>

                    <div className="alert alert-danger mt-4">
                      Certificate ID: {certificateNumber}
                    </div>
                  </>
                )}

                <Link to="/" className="btn btn-primary-custom mt-4">
                  <i className="bi bi-house me-2"></i>
                  Return Home
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CertificateVerificationPage;