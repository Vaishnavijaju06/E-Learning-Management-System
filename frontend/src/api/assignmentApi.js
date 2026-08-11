import apiClient from "./apiClient";

const assignmentApi = {
  instructorList() {
    return apiClient.get(
      "/instructor/assignments"
    );
  },

  create(data) {
    return apiClient.post(
      "/instructor/assignments",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },

  publish(id) {
    return apiClient.put(
      `/instructor/assignments/${id}/publish`
    );
  },

  close(id) {
    return apiClient.put(
      `/instructor/assignments/${id}/close`
    );
  },

  remove(id) {
    return apiClient.delete(
      `/instructor/assignments/${id}`
    );
  },

  submissions(id) {
    return apiClient.get(
      `/instructor/assignments/${id}/submissions`
    );
  },

  evaluate(id, data) {
    return apiClient.put(
      `/instructor/submissions/${id}/evaluate`,
      data
    );
  },

  studentList() {
    return apiClient.get(
      "/student/assignments"
    );
  },

  mySubmissions() {
    return apiClient.get(
      "/student/submissions"
    );
  },

  submit(id, data) {
    return apiClient.post(
      `/student/assignments/${id}/submit`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },

  downloadAssignment(id) {
    return apiClient.get(
      `/assignments/${id}/download`,
      {
        responseType: "blob"
      }
    );
  },

  downloadSubmission(id) {
    return apiClient.get(
      `/submissions/${id}/download`,
      {
        responseType: "blob"
      }
    );
  }
};

export default assignmentApi;