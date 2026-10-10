import api from './api';

export const getAnalyticsOverview = () => api.get('/analytics/overview');
export const getWardrobeAnalytics = () => api.get('/analytics/wardrobe');
export const getOutfitAnalytics = () => api.get('/analytics/outfits');
export const getStyleAnalytics = () => api.get('/analytics/style');
