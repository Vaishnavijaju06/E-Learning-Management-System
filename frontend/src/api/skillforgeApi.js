import apiClient from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("/auth/login", data),
  register: (data) => apiClient.post("/auth/register", data),
  me: () => apiClient.get("/auth/me"),
  forgotPassword: (email) =>
    apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    apiClient.post("/auth/reset-password", {
      token,
      newPassword
    })
};

export const contactApi = {
  create: (data) => apiClient.post("/contact", data),
  list: () => apiClient.get("/contact")
};

export const categoryApi = {
  list: () => apiClient.get("/categories"),
  create: (data) => apiClient.post("/categories", data),
  update: (id, data) =>
    apiClient.put(`/categories/${id}`, data),
  remove: (id) => apiClient.delete(`/categories/${id}`)
};

export const courseApi = {
  list: (search = "") =>
    apiClient.get("/courses", {
      params: search ? { search } : {}
    }),
  get: (id) => apiClient.get(`/courses/${id}`),
  instructorList: () =>
    apiClient.get("/instructor/courses"),
  create: (data) =>
    apiClient.post("/instructor/courses", data),
  update: (id, data) =>
    apiClient.put(`/instructor/courses/${id}`, data),
  submit: (id) =>
    apiClient.post(`/instructor/courses/${id}/submit`),
  remove: (id) =>
    apiClient.delete(`/instructor/courses/${id}`),
  pending: () =>
    apiClient.get("/admin/courses/pending"),
  setStatus: (id, status) =>
    apiClient.patch(`/admin/courses/${id}/status`, null, {
      params: { status }
    })
};

export const contentApi = {
  get: (courseId) =>
    apiClient.get(`/learning/courses/${courseId}`),
  addModule: (courseId, data) =>
    apiClient.post(
      `/instructor/courses/${courseId}/modules`,
      data
    ),
  addLesson: (moduleId, data) =>
    apiClient.post(
      `/instructor/modules/${moduleId}/lessons`,
      data
    ),
  completeLesson: (lessonId) =>
    apiClient.put(
      `/learning/lessons/${lessonId}/complete`
    )
};

export const quizApi = {
  create: (moduleId, data) =>
    apiClient.post(
      `/instructor/modules/${moduleId}/quiz`,
      data
    ),
  getForStudent: (moduleId) =>
    apiClient.get(`/quizzes/module/${moduleId}`),
  submit: (quizId, answers) =>
    apiClient.post(`/quizzes/${quizId}/submit`, {
      answers
    })
};

export const paymentApi = {
  checkout(courseId) {
    return apiClient.post("/payments/checkout", {
      courseId
    });
  },

  createRazorpayOrder(courseId) {
    return apiClient.post(
      `/payments/razorpay/orders/${courseId}`
    );
  },

  verifyRazorpayPayment(paymentData) {
    return apiClient.post(
      "/payments/razorpay/verify",
      paymentData
    );
  },

  mine() {
    return apiClient.get("/payments/my");
  }
};

export const enrollmentApi = {
  mine: () => apiClient.get("/enrollments/my")
};

export const wishlistApi = {
  mine: () => apiClient.get("/wishlist"),
  add: (courseId) =>
    apiClient.post(`/wishlist/${courseId}`),
  remove: (courseId) =>
    apiClient.delete(`/wishlist/${courseId}`)
};

export const certificateApi = {
  issue: (courseId) =>
    apiClient.post(`/certificates/course/${courseId}`),
  mine: () => apiClient.get("/certificates/my"),
  verify: (serial) =>
    apiClient.get(`/certificates/verify/${serial}`),
  download: (serial) =>
    apiClient.get(`/certificates/${serial}/download`, {
      responseType: "blob"
    })
};

export const userApi = {
  profile: () => apiClient.get("/profile"),
  updateProfile: (data) => apiClient.put("/profile", data),
  changePassword: (currentPassword, newPassword) =>
    apiClient.post("/profile/change-password", {
      currentPassword,
      newPassword
    }),
  all: () => apiClient.get("/admin/users"),
  setStatus: (id, status) =>
    apiClient.patch(`/admin/users/${id}/status`, null, {
      params: { status }
    }),
  remove: (id) => apiClient.delete(`/admin/users/${id}`)
};

export const dashboardApi = {
  get: () => apiClient.get("/dashboard")
};

export const chatbotApi = {
  send: (data) => apiClient.post("/chatbot/chat", data)
};