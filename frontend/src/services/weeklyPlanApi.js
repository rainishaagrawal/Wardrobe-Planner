import api from './api';

export const generateWeeklyPlan = (data) => api.post('/weekly-plan/generate', data);
export const getCurrentWeeklyPlan = (params) => api.get('/weekly-plan', { params });
export const getWeeklyPlan = (id) => api.get(`/weekly-plan/${id}`);
export const updatePlanDay = (planId, date, data) => api.put(`/weekly-plan/${planId}/day/${date}`, data);
export const regeneratePlanDay = (planId, date, data) => api.post(`/weekly-plan/${planId}/day/${date}/regenerate`, data);
export const markPlanDayWorn = (planId, date) => api.post(`/weekly-plan/${planId}/day/${date}/worn`);
export const skipPlanDay = (planId, date) => api.post(`/weekly-plan/${planId}/day/${date}/skip`);
