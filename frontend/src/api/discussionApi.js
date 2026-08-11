import apiClient from "./apiClient";

const discussionApi = {
  create(data) {
    return apiClient.post("/discussions", data);
  },

  getCourseDiscussions(courseId) {
    return apiClient.get(
      `/discussions/course/${courseId}`
    );
  },

  getDiscussion(discussionId) {
    return apiClient.get(
      `/discussions/${discussionId}`
    );
  },

  addReply(discussionId, data) {
    return apiClient.post(
      `/discussions/${discussionId}/replies`,
      data
    );
  },

  resolve(discussionId) {
    return apiClient.put(
      `/discussions/${discussionId}/resolve`
    );
  },

  close(discussionId) {
    return apiClient.put(
      `/discussions/${discussionId}/close`
    );
  },

  delete(discussionId) {
    return apiClient.delete(
      `/discussions/${discussionId}`
    );
  }
};

export default discussionApi;