import api from './api';

export const getStyleProfile = () => api.get('/style/profile');
export const updateStyleProfile = (data) => api.put('/style/profile', data);
export const addTemporaryPreference = (data) => api.post('/style/temporary-preference', data);
export const removeTemporaryPreference = (id) => api.delete(`/style/temporary-preference/${id}`);
