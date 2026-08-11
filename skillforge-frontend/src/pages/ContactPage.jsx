import { useState } from "react";

import "./ContactPage.css";
import { contactApi } from "../api/skillforgeApi";
import getErrorMessage from "../api/getErrorMessage";
import AlertMessage from "../components/AlertMessage";
import { useToast } from "../context/ToastContext";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await contactApi.create(form);

      setForm(emptyForm);
      toast.success(
        "Thanks for reaching out! We'll get back to you soon."
      );
    } catch (requestError) {
      const errorMessage = getErrorMessage(
        requestError,
        "Unable to send your message"
      );
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="container text-center">
          <h1>Contact Us</h1>
          <p>
            Have a question? We'd love to hear from you.
            Reach out to the SkillForge team anytime.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container py-5">
        <div className="row g-4">

          <div className="col-md-6 col-lg-3">
            <div className="contact-card">
              <i className="bi bi-envelope-fill"></i>
              <h5>Email</h5>
              <p>support@skillforge.com</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="contact-card">
              <i className="bi bi-telephone-fill"></i>
              <h5>Phone</h5>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="contact-card">
              <i className="bi bi-geo-alt-fill"></i>
              <h5>Address</h5>
              <p>Bilaspur, Chhattisgarh</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="contact-card">
              <i className="bi bi-clock-fill"></i>
              <h5>Working Hours</h5>
              <p>Mon - Sat<br />9:00 AM - 6:00 PM</p>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Form */}
      <section className="container pb-5">
        <div className="contact-form-box">

          <h2 className="mb-4">Send us a Message</h2>

          <AlertMessage>{error}</AlertMessage>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={update}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={update}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="Enter subject"
                required
                value={form.subject}
                onChange={update}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Message</label>
              <textarea
                rows="5"
                name="message"
                className="form-control"
                placeholder="Write your message"
                required
                value={form.message}
                onChange={update}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>
      </section>
    </>
  );
}
