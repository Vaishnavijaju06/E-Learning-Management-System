import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { Link, useParams } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import {
  certificateApi,
  contentApi,
  quizApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";

function QuizPanel({ module, onCompleted }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    quizApi
      .getForStudent(module.id)
      .then((response) => setQuiz(response.data))
      .catch((error) =>
        setMessage(getErrorMessage(error, "Quiz is unavailable"))
      )
      .finally(() => setLoading(false));
  }, [module.id]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await quizApi.submit(quiz.id, answers);
      setResult(response.data);
      if (response.data.passed) {
        onCompleted();
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading quiz..." />;
  }

  if (!quiz) {
    return <AlertMessage type="info">{message}</AlertMessage>;
  }

  return (
    <form onSubmit={submit}>
      <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <div>
          <h3 className="h5 mb-1">{quiz.title}</h3>
          <span className="small text-secondary">
            Pass mark: {quiz.passingMarks} · Attempts used:{" "}
            {quiz.attemptsUsed}/{quiz.maxAttempts}
          </span>
        </div>
      </div>

      {quiz.questions.map((question, questionIndex) => (
        <fieldset className="quiz-question mb-3" key={question.id}>
          <legend className="fs-6 fw-semibold">
            {questionIndex + 1}. {question.text} (
            {question.marks} mark)
          </legend>

          {question.options.map((option) => (
            <div className="form-check" key={option.id}>
              <input
                className="form-check-input"
                type="radio"
                name={`question-${question.id}`}
                id={`option-${option.id}`}
                checked={answers[question.id] === option.id}
                onChange={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: option.id
                  }))
                }
              />
              <label
                className="form-check-label"
                htmlFor={`option-${option.id}`}
              >
                {option.text}
              </label>
            </div>
          ))}
        </fieldset>
      ))}

      <AlertMessage>{message}</AlertMessage>

      {result && (
        <AlertMessage type={result.passed ? "success" : "warning"}>
          Score: {result.score}/{result.totalMarks}.{" "}
          {result.passed
            ? "Quiz passed."
            : `Try again. ${result.attemptsRemaining} attempt(s) remain.`}
        </AlertMessage>
      )}

      <button
        className="btn btn-primary"
        type="submit"
        disabled={
          Object.keys(answers).length !== quiz.questions.length
        }
      >
        Submit Quiz
      </button>
    </form>
  );
}

export default function LearningPage() {
  const { courseId } = useParams();
  const [content, setContent] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeQuizModuleId, setActiveQuizModuleId] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  const loadContent = useCallback(async () => {
    const response = await contentApi.get(courseId);
    setContent(response.data);

    setActiveLessonId((current) => {
      if (current) {
        return current;
      }

      return response.data.modules
        .flatMap((module) => module.lessons)
        .find((lesson) => !lesson.completed)?.id ??
        response.data.modules[0]?.lessons[0]?.id ??
        null;
    });
  }, [courseId]);

  useEffect(() => {
    loadContent()
      .catch((error) => setMessage(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [loadContent]);

  const lessons = useMemo(
    () =>
      content?.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
          ...lesson,
          moduleTitle: module.title
        }))
      ) ?? [],
    [content]
  );

  const activeLesson = lessons.find(
    (lesson) => lesson.id === activeLessonId
  );

  async function completeLesson() {
    if (!activeLesson) {
      return;
    }

    setWorking(true);
    setMessage("");

    try {
      await contentApi.completeLesson(activeLesson.id);
      await loadContent();
      setMessage("Lesson completed. Progress updated.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setWorking(false);
    }
  }

  async function requestCertificate() {
    setWorking(true);
    setMessage("");

    try {
      const response = await certificateApi.issue(courseId);
      setMessage(
        `Certificate ready: ${response.data.serialNumber}`
      );
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Opening your course..." />;
  }

  if (!content) {
    return (
      <div className="container py-5">
        <AlertMessage>{message}</AlertMessage>
        <Link to="/student/learning">← My Learning</Link>
      </div>
    );
  }

  return (
    <div className="learning-shell">
      <aside className="learning-sidebar">
        <Link
          className="small text-decoration-none"
          to="/student/learning"
        >
          ← My Learning
        </Link>
        <h1 className="h5 fw-bold mt-3">
          {content.course.title}
        </h1>
        <div className="d-flex justify-content-between small mb-1">
          <span>Progress</span>
          <strong>{content.progressPercent}%</strong>
        </div>
        <div className="progress mb-4">
          <div
            className="progress-bar"
            style={{ width: `${content.progressPercent}%` }}
          ></div>
        </div>

        {content.modules.map((module) => (
          <section className="mb-4" key={module.id}>
            <h2 className="h6 text-uppercase text-secondary">
              {module.title}
            </h2>
            <div className="list-group list-group-flush">
              {module.lessons.map((lesson) => (
                <button
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    lesson.id === activeLessonId &&
                    !activeQuizModuleId
                      ? "active"
                      : ""
                  }`}
                  key={lesson.id}
                  onClick={() => {
                    setActiveLessonId(lesson.id);
                    setActiveQuizModuleId(null);
                  }}
                >
                  <i
                    className={`bi ${
                      lesson.completed
                        ? "bi-check-circle-fill"
                        : "bi-play-circle"
                    } me-2`}
                  ></i>
                  {lesson.title}
                </button>
              ))}

              {module.quizId && (
                <button
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    activeQuizModuleId === module.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveQuizModuleId(module.id)
                  }
                >
                  <i className="bi bi-patch-question me-2"></i>
                  Module Quiz
                </button>
              )}
            </div>
          </section>
        ))}
      </aside>

      <main className="learning-content">
        <AlertMessage type="info">{message}</AlertMessage>

        {activeQuizModuleId ? (
          <QuizPanel
            module={content.modules.find(
              (module) => module.id === activeQuizModuleId
            )}
            onCompleted={loadContent}
          />
        ) : activeLesson ? (
          <article>
            <span className="text-primary small fw-semibold">
              {activeLesson.moduleTitle}
            </span>
            <h2 className="fw-bold mt-1">
              {activeLesson.title}
            </h2>

            {activeLesson.videoUrl && (
              <div className="ratio ratio-16x9 my-4">
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="lesson-text">
              {activeLesson.content || "Watch the lesson video."}
            </div>

            <button
              className={`btn mt-4 ${
                activeLesson.completed
                  ? "btn-success"
                  : "btn-primary"
              }`}
              type="button"
              disabled={working || activeLesson.completed}
              onClick={completeLesson}
            >
              <i className="bi bi-check2-circle me-2"></i>
              {activeLesson.completed
                ? "Completed"
                : "Mark as Complete"}
            </button>
          </article>
        ) : (
          <div className="empty-state">
            <i className="bi bi-journal-text"></i>
            <p>No lessons have been added yet.</p>
          </div>
        )}

        {content.progressPercent === 100 && (
          <div className="certificate-callout mt-5">
            <div>
              <h2 className="h5 fw-bold">
                Course lessons completed
              </h2>
              <p className="mb-0">
                Pass all module quizzes, then generate your
                certificate.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-warning"
              disabled={working}
              onClick={requestCertificate}
            >
              Generate Certificate
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
