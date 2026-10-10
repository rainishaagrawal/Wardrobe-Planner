import api from './api';

export const getInspirations = (params) => api.get('/inspiration', { params });
export const getInspiration = (id) => api.get(`/inspiration/${id}`);
export const createInspiration = (data) => api.post('/inspiration', data);
export const updateInspiration = (id, data) => api.put(`/inspiration/${id}`, data);
export const deleteInspiration = (id) => api.delete(`/inspiration/${id}`);
export const analyzeInspiration = (id) => api.post(`/inspiration/${id}/analyze`);
export const generateOutfitFromInspiration = (data) => api.post('/outfits/from-inspiration', data);
