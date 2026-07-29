import instructorCourseService from "./instructorCourseService";

const STORAGE_KEY = "skillforgeInstructorCurricula";

const starterCurricula = {
  101: [
    {
      id: 10101,
      title: "Getting Started",
      lessons: [
        {
          id: 1010101,
          title: "Course Introduction",
          type: "VIDEO",
          duration: 8,
          contentUrl: "https://www.youtube.com/",
          preview: true,
          published: true,
        },
      ],
    },
  ],
};

const readAll = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored && typeof stored === "object") return stored;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(starterCurricula));
  return starterCurricula;
};

const saveAll = (curricula) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(curricula));
};

const saveCourseCurriculum = (courseId, modules) => {
  const curricula = readAll();
  curricula[String(courseId)] = modules;
  saveAll(curricula);
  instructorCourseService.updateLessonCount(
    Number(courseId),
    modules.reduce((total, module) => total + module.lessons.length, 0)
  );
  return modules;
};

const createId = () => Date.now() + Math.floor(Math.random() * 1000);

const curriculumService = {
  getCurriculum(courseId) {
    return readAll()[String(courseId)] || [];
  },

  addModule(courseId, title) {
    const modules = this.getCurriculum(courseId);
    return saveCourseCurriculum(courseId, [
      ...modules,
      { id: createId(), title: title.trim(), lessons: [] },
    ]);
  },

  updateModule(courseId, moduleId, title) {
    return saveCourseCurriculum(
      courseId,
      this.getCurriculum(courseId).map((module) =>
        module.id === moduleId ? { ...module, title: title.trim() } : module
      )
    );
  },

  deleteModule(courseId, moduleId) {
    return saveCourseCurriculum(
      courseId,
      this.getCurriculum(courseId).filter((module) => module.id !== moduleId)
    );
  },

  moveModule(courseId, moduleId, direction) {
    const modules = [...this.getCurriculum(courseId)];
    const index = modules.findIndex((module) => module.id === moduleId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= modules.length) return modules;
    [modules[index], modules[target]] = [modules[target], modules[index]];
    return saveCourseCurriculum(courseId, modules);
  },

  saveLesson(courseId, moduleId, lessonData, lessonId) {
    const lesson = {
      ...lessonData,
      id: lessonId || createId(),
      duration: Number(lessonData.duration),
    };
    return saveCourseCurriculum(
      courseId,
      this.getCurriculum(courseId).map((module) => {
        if (module.id !== moduleId) return module;
        const exists = module.lessons.some((item) => item.id === lessonId);
        return {
          ...module,
          lessons: exists
            ? module.lessons.map((item) => (item.id === lessonId ? lesson : item))
            : [...module.lessons, lesson],
        };
      })
    );
  },

  deleteLesson(courseId, moduleId, lessonId) {
    return saveCourseCurriculum(
      courseId,
      this.getCurriculum(courseId).map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : module
      )
    );
  },

  moveLesson(courseId, moduleId, lessonId, direction) {
    const modules = this.getCurriculum(courseId).map((module) => {
      if (module.id !== moduleId) return module;
      const lessons = [...module.lessons];
      const index = lessons.findIndex((lesson) => lesson.id === lessonId);
      const target = index + direction;
      if (index >= 0 && target >= 0 && target < lessons.length) {
        [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
      }
      return { ...module, lessons };
    });
    return saveCourseCurriculum(courseId, modules);
  },
};

export default curriculumService;
