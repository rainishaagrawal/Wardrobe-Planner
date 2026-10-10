import api from './api';

export const generateOutfits = (data) => api.post('/outfits/generate', data);
export const getTodayOutfits = (params) => api.get('/outfits/today', { params });
export const getOutfit = (id) => api.get(`/outfits/${id}`);
export const saveOutfit = (id) => api.post(`/outfits/${id}/save`);
export const createOutfit = (data) => api.post('/outfits/save', data);
export const markOutfitWorn = (id) => api.post(`/outfits/${id}/worn`);
export const styleItem = (id, data) => api.post(`/outfits/${id}/style-item`, data);
export const getSurpriseOutfit = (data) => api.post('/outfits/surprise', data);
export const getOutfitHistory = (params) => api.get('/outfits/history', { params });
