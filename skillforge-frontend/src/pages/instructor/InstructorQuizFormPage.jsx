import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import instructorCourseService from "../../services/instructorCourseService";
import instructorQuizService from "../../services/instructorQuizService";

const emptyQuestion = () => ({
  id: Date.now(),
  text: "",
  marks: 1,
  options: [1, 2, 3, 4].map((id) => ({ id, text: "", correct: id === 1 })),
});

function InstructorQuizFormPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const courses = instructorCourseService.getCourses();
  const existing = quizId ? instructorQuizService.getQuizById(quizId) : null;
  const [form, setForm] = useState(
    existing || {
      title: "", description: "", courseId: courses[0]?.id || "",
      duration: 15, passingScore: 60, maxAttempts: 3,
      status: "DRAFT", questions: [],
    }
  );
  const [errors, setErrors] = useState({});

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const updateQuestion = (index, field, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, i) =>
        i === index ? { ...question, [field]: value } : question
      ),
    }));
  };
  const updateOption = (questionIndex, optionIndex, value) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, i) =>
        i !== questionIndex ? question : {
          ...question,
          options: question.options.map((option, j) =>
            j === optionIndex ? { ...option, text: value } : option
          ),
        }
      ),
    }));
  };
  const setCorrect = (questionIndex, optionIndex) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, i) =>
        i !== questionIndex ? question : {
          ...question,
          options: question.options.map((option, j) => ({ ...option, correct: j === optionIndex })),
        }
      ),
    }));
  };

  const validate = (status) => {
    const next = {};
    if (!form.title.trim()) next.title = "Quiz title is required.";
    if (!form.courseId) next.courseId = "Select a course.";
    if (Number(form.duration) < 1) next.duration = "Duration must be at least one minute.";
    if (Number(form.passingScore) < 1 || Number(form.passingScore) > 100) next.passingScore = "Enter a score from 1 to 100.";
    if (Number(form.maxAttempts) < 1) next.maxAttempts = "At least one attempt is required.";
    if (status === "PUBLISHED" && form.questions.length === 0) next.questions = "Add at least one question before publishing.";
    form.questions.forEach((question, index) => {
      if (!question.text.trim() || question.options.some((option) => !option.text.trim())) {
        next.questions = `Complete question ${index + 1} and all its options.`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (status) => {
    if (!validate(status)) return;
    instructorQuizService.saveQuiz({ ...form, status });
    toast.success(`Quiz ${status === "PUBLISHED" ? "published" : "saved as draft"}.`);
    navigate("/instructor/quizzes");
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/instructor/quizzes" className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i></Link>
        <div><h1 className="h3 fw-bold mb-1">{quizId ? "Edit Quiz" : "Create Quiz"}</h1><p className="text-secondary mb-0">Configure rules and build MCQ questions.</p></div>
      </div>

      <div className="card border-0 shadow-sm mb-4"><div className="card-body p-4">
        <h2 className="h5 fw-bold mb-3">Quiz information</h2>
        <div className="row g-3">
          <div className="col-md-8"><label className="form-label">Quiz title *</label><input className={`form-control ${errors.title ? "is-invalid" : ""}`} value={form.title} onChange={(e) => setField("title", e.target.value)} /><div className="invalid-feedback">{errors.title}</div></div>
          <div className="col-md-4"><label className="form-label">Course *</label><select className={`form-select ${errors.courseId ? "is-invalid" : ""}`} value={form.courseId} onChange={(e) => setField("courseId", e.target.value)}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><div className="invalid-feedback">{errors.courseId}</div></div>
          <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="2" value={form.description} onChange={(e) => setField("description", e.target.value)} /></div>
          {[["duration", "Duration (minutes)", 1], ["passingScore", "Passing score (%)", 1], ["maxAttempts", "Maximum attempts", 1]].map(([name, label, min]) => <div className="col-md-4" key={name}><label className="form-label">{label}</label><input type="number" min={min} className={`form-control ${errors[name] ? "is-invalid" : ""}`} value={form[name]} onChange={(e) => setField(name, e.target.value)} /><div className="invalid-feedback">{errors[name]}</div></div>)}
        </div>
      </div></div>

      <div className="d-flex justify-content-between align-items-center mb-3"><div><h2 className="h5 fw-bold mb-0">Questions ({form.questions.length})</h2>{errors.questions && <small className="text-danger">{errors.questions}</small>}</div><button className="btn btn-outline-primary" onClick={() => setField("questions", [...form.questions, emptyQuestion()])}><i className="bi bi-plus-lg me-2"></i>Add MCQ</button></div>
      {form.questions.map((question, questionIndex) => (
        <div className="card border-0 shadow-sm mb-3" key={question.id}><div className="card-body p-4">
          <div className="d-flex justify-content-between gap-3 mb-3"><h3 className="h6 fw-bold">Question {questionIndex + 1}</h3><button className="btn btn-sm btn-outline-danger" onClick={() => setField("questions", form.questions.filter((_, i) => i !== questionIndex))}><i className="bi bi-trash"></i></button></div>
          <div className="row g-3">
            <div className="col-md-10"><input className="form-control" placeholder="Enter question" value={question.text} onChange={(e) => updateQuestion(questionIndex, "text", e.target.value)} /></div>
            <div className="col-md-2"><input type="number" min="1" className="form-control" value={question.marks} onChange={(e) => updateQuestion(questionIndex, "marks", Number(e.target.value))} title="Marks" /></div>
            {question.options.map((option, optionIndex) => <div className="col-md-6" key={option.id}><div className="input-group"><span className="input-group-text"><input type="radio" name={`correct-${question.id}`} checked={option.correct} onChange={() => setCorrect(questionIndex, optionIndex)} aria-label="Correct option" /></span><input className="form-control" placeholder={`Option ${optionIndex + 1}`} value={option.text} onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)} /></div></div>)}
          </div>
          <small className="text-secondary d-block mt-2">Select the radio button beside the correct answer.</small>
        </div></div>
      ))}
      {form.questions.length === 0 && <div className="alert alert-light border text-center py-4">No questions added yet. Add an MCQ to begin.</div>}

      <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
        <Link className="btn btn-outline-secondary" to="/instructor/quizzes">Cancel</Link>
        <button className="btn btn-outline-primary" onClick={() => submit("DRAFT")}>Save Draft</button>
        <button className="btn btn-primary" onClick={() => submit("PUBLISHED")}><i className="bi bi-send me-2"></i>Save & Publish</button>
      </div>
    </div>
  );
}

export default InstructorQuizFormPage;
