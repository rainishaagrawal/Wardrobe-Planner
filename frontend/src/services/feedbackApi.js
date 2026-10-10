import api from './api';

export const createOutfitFeedback = (outfitId, data) => api.post(`/feedback/outfit/${outfitId}`, data);
export const getFeedback = (params) => api.get('/feedback', { params });
export const getFeedbackById = (id) => api.get(`/feedback/${id}`);
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);
