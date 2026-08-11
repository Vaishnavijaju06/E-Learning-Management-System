import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import getErrorMessage from "../api/getErrorMessage";
import {
  contentApi,
  quizApi
} from "../api/skillforgeApi";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export default function CourseBuilderPage() {
  const toast = useToast();
  const { courseId } = useParams();
  const [content, setContent] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    position: 1
  });
  const [lessonForm, setLessonForm] = useState({
    moduleId: "",
    title: "",
    content: "",
    videoUrl: "",
    position: 1
  });
  const [quizForm, setQuizForm] = useState({
    moduleId: "",
    title: "Module Quiz",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "1",
    passingMarks: 1,
    maxAttempts: 3
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const response = await contentApi.get(courseId);
      setContent(response.data);

      const firstModule = response.data.modules[0];
      const quizModules = response.data.modules.filter(
        (module) => !module.quizId
      );

      if (firstModule) {
        setLessonForm((current) => ({
          ...current,
          moduleId: current.moduleId || firstModule.id
        }));
        setQuizForm((current) => ({
          ...current,
          moduleId: quizModules.some(
            (module) =>
              String(module.id) === String(current.moduleId)
          )
            ? current.moduleId
            : quizModules[0]?.id || ""
        }));
      }
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function addModule(event) {
    event.preventDefault();

    try {
      await contentApi.addModule(courseId, {
        ...moduleForm,
        position: Number(moduleForm.position)
      });
      setModuleForm({
        title: "",
        position: content.modules.length + 2
      });
      setMessage("Module added.");
      toast.success("Module added successfully.");
      await load();
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  async function addLesson(event) {
    event.preventDefault();

    try {
      await contentApi.addLesson(
        lessonForm.moduleId,
        {
          title: lessonForm.title,
          content: lessonForm.content,
          videoUrl: lessonForm.videoUrl,
          position: Number(lessonForm.position)
        }
      );
      setLessonForm({
        ...lessonForm,
        title: "",
        content: "",
        videoUrl: "",
        position: Number(lessonForm.position) + 1
      });
      setMessage("Lesson added.");
      toast.success("Lesson added successfully.");
      await load();
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  async function addQuiz(event) {
    event.preventDefault();

    const optionValues = [
      quizForm.option1,
      quizForm.option2,
      quizForm.option3,
      quizForm.option4
    ];

    try {
      await quizApi.create(quizForm.moduleId, {
        title: quizForm.title,
        passingMarks: Number(quizForm.passingMarks),
        maxAttempts: Number(quizForm.maxAttempts),
        published: true,
        questions: [
          {
            text: quizForm.question,
            marks: 1,
            options: optionValues.map((text, index) => ({
              text,
              correct:
                index + 1 ===
                Number(quizForm.correctOption)
            }))
          }
        ]
      });
      setMessage("Quiz added.");
      toast.success("Quiz added successfully.");
      await load();
    } catch (requestError) {
      const errorMessage = getErrorMessage(requestError);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading course builder..." />;
  }

  if (!content) {
    return (
      <div className="container py-5">
        <AlertMessage>{error}</AlertMessage>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link
        className="btn btn-link px-0"
        to="/instructor/courses"
      >
        ← Back to courses
      </Link>
      <div className="section-heading mb-4">
        <span className="section-eyebrow">Course builder</span>
        <h1>{content.course.title}</h1>
        <p>Add modules, lessons and a quiz for each module.</p>
      </div>

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage type="success">{message}</AlertMessage>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="accordion shadow-sm" id="courseModules">
            {content.modules.map((module, index) => (
              <div className="accordion-item" key={module.id}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      index ? "collapsed" : ""
                    }`}
                    data-bs-toggle="collapse"
                    data-bs-target={`#module-${module.id}`}
                  >
                    Module {module.position}: {module.title}
                  </button>
                </h2>
                <div
                  id={`module-${module.id}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#courseModules"
                >
                  <div className="accordion-body">
                    <ul className="list-group list-group-flush">
                      {module.lessons.map((lesson) => (
                        <li
                          className="list-group-item px-0"
                          key={lesson.id}
                        >
                          <i className="bi bi-play-circle me-2"></i>
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`badge mt-3 ${
                        module.quizId
                          ? "text-bg-success"
                          : "text-bg-secondary"
                      }`}
                    >
                      {module.quizId
                        ? "Quiz added"
                        : "No quiz"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {content.modules.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-list-ol"></i>
              <p>Add the first course module.</p>
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <form className="card-body" onSubmit={addModule}>
              <h2 className="h5">Add Module</h2>
              <input
                className="form-control my-3"
                placeholder="Module title"
                required
                value={moduleForm.title}
                onChange={(event) =>
                  setModuleForm({
                    ...moduleForm,
                    title: event.target.value
                  })
                }
              />
              <input
                type="number"
                min="1"
                className="form-control mb-3"
                value={moduleForm.position}
                onChange={(event) =>
                  setModuleForm({
                    ...moduleForm,
                    position: event.target.value
                  })
                }
              />
              <button className="btn btn-primary">
                Add Module
              </button>
            </form>
          </div>

          {content.modules.length > 0 && (
            <>
              <div className="card border-0 shadow-sm mb-4">
                <form className="card-body" onSubmit={addLesson}>
                  <h2 className="h5">Add Lesson</h2>
                  <select
                    className="form-select my-3"
                    value={lessonForm.moduleId}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        moduleId: event.target.value
                      })
                    }
                  >
                    {content.modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                  <input
                    className="form-control mb-3"
                    placeholder="Lesson title"
                    required
                    value={lessonForm.title}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        title: event.target.value
                      })
                    }
                  />
                  <textarea
                    className="form-control mb-3"
                    placeholder="Lesson explanation"
                    rows="3"
                    value={lessonForm.content}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        content: event.target.value
                      })
                    }
                  ></textarea>
                  <input
                    className="form-control mb-3"
                    placeholder="Video URL"
                    value={lessonForm.videoUrl}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        videoUrl: event.target.value
                      })
                    }
                  />
                  <input
                    type="number"
                    min="1"
                    className="form-control mb-3"
                    value={lessonForm.position}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        position: event.target.value
                      })
                    }
                  />
                  <button className="btn btn-primary">
                    Add Lesson
                  </button>
                </form>
              </div>

              <div className="card border-0 shadow-sm">
                <form className="card-body" onSubmit={addQuiz}>
                  <h2 className="h5">Add One-question Quiz</h2>
                  <select
                    className="form-select my-3"
                    value={quizForm.moduleId}
                    onChange={(event) =>
                      setQuizForm({
                        ...quizForm,
                        moduleId: event.target.value
                      })
                    }
                  >
                    {content.modules
                      .filter((module) => !module.quizId)
                      .map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.title}
                        </option>
                      ))}
                  </select>
                  {[
                    ["title", "Quiz title"],
                    ["question", "Question"],
                    ["option1", "Option 1"],
                    ["option2", "Option 2"],
                    ["option3", "Option 3"],
                    ["option4", "Option 4"]
                  ].map(([name, placeholder]) => (
                    <input
                      key={name}
                      className="form-control mb-2"
                      placeholder={placeholder}
                      required
                      value={quizForm[name]}
                      onChange={(event) =>
                        setQuizForm({
                          ...quizForm,
                          [name]: event.target.value
                        })
                      }
                    />
                  ))}
                  <label className="form-label">
                    Correct option
                  </label>
                  <select
                    className="form-select mb-3"
                    value={quizForm.correctOption}
                    onChange={(event) =>
                      setQuizForm({
                        ...quizForm,
                        correctOption: event.target.value
                      })
                    }
                  >
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                    <option value="4">Option 4</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    disabled={
                      content.modules.every(
                        (module) => module.quizId
                      )
                    }
                  >
                    Add Quiz
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
