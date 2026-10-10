import { useState, useCallback } from 'react';
import * as weeklyPlanApi from '../services/weeklyPlanApi';
import { getApiErrorMessage } from '../services/api';

export const useWeeklyPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCurrentPlan = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await weeklyPlanApi.getCurrentWeeklyPlan();
      // Usually returns an array or single plan
      const data = res.data?.data?.plan || res.data?.plan || res.data;
      if (Array.isArray(data)) {
        setPlan(data[0] || null);
      } else {
        setPlan(data || null);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePlan = useCallback(async (data = {}) => {
    setLoading(true); setError('');
    try {
      const res = await weeklyPlanApi.generateWeeklyPlan(data);
      const newPlan = res.data?.data?.plan || res.data?.plan || res.data;
      setPlan(newPlan);
    } catch (err) {
      setError(getApiErrorMessage(err) || "We couldn't plan your week. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const _updateLocalDay = (date, updatedDayData) => {
    setPlan(prev => {
      if (!prev) return prev;
      const newDays = prev.days.map(d => 
        (new Date(d.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]) 
          ? { ...d, ...updatedDayData } 
          : d
      );
      return { ...prev, days: newDays };
    });
  };

  const _formatDate = (d) => new Date(d).toISOString().split('T')[0];

  const updateDay = useCallback(async (planId, date, data) => {
    try {
      const res = await weeklyPlanApi.updatePlanDay(planId, _formatDate(date), data);
      const updatedDay = res.data?.data?.day || res.data?.day || res.data;
      _updateLocalDay(date, updatedDay);
    } catch (err) {
      alert(getApiErrorMessage(err) || "Couldn't update this day.");
      throw err;
    }
  }, []);

  const regenerateDay = useCallback(async (planId, date, data = {}) => {
    try {
      const res = await weeklyPlanApi.regeneratePlanDay(planId, _formatDate(date), data);
      // Backend returns the full updated plan
      const updatedPlan = res.data?.data?.plan || res.data?.plan || res.data;
      if (updatedPlan && updatedPlan.days) {
        setPlan(updatedPlan);
      } else {
        // fallback: re-fetch current plan
        await fetchCurrentPlan();
      }
    } catch (err) {
      alert(getApiErrorMessage(err) || "Couldn't create a new look. Make sure you have items in your wardrobe.");
      throw err;
    }
  }, [fetchCurrentPlan]);

  const markDayWorn = useCallback(async (planId, date) => {
    try {
      const res = await weeklyPlanApi.markPlanDayWorn(planId, _formatDate(date));
      const updatedPlan = res.data?.data?.plan || res.data?.plan || res.data;
      if (updatedPlan && updatedPlan.days) {
        setPlan(updatedPlan);
      } else {
        _updateLocalDay(date, { status: 'worn' });
      }
    } catch (err) {
      alert(getApiErrorMessage(err) || "Couldn't mark this outfit as worn.");
      throw err;
    }
  }, []);

  const skipDay = useCallback(async (planId, date) => {
    try {
      const res = await weeklyPlanApi.skipPlanDay(planId, _formatDate(date));
      const updatedPlan = res.data?.data?.plan || res.data?.plan || res.data;
      if (updatedPlan && updatedPlan.days) {
        setPlan(updatedPlan);
      } else {
        _updateLocalDay(date, { status: 'skipped' });
      }
    } catch (err) {
      alert(getApiErrorMessage(err) || "Couldn't skip this day.");
      throw err;
    }
  }, []);

  return { plan, loading, error, fetchCurrentPlan, generatePlan, updateDay, regenerateDay, markDayWorn, skipDay };
};
