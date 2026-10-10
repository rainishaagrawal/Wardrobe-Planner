import { useState, useCallback } from 'react';
import * as outfitApi from '../services/outfitApi';
import { getApiErrorMessage } from '../services/api';

export const useOutfitRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = useCallback(async (data = {}) => {
    setLoading(true); setError('');
    try {
      const res = await outfitApi.generateOutfits(data);
      const outfits = res.data?.data?.outfits || res.data?.outfits || res.data || [];
      setRecommendations(Array.isArray(outfits) ? outfits : [outfits]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchToday = useCallback(async () => {
    setLoading(true); setError('');
    try {
      let outfits = [];
      try {
        const res = await outfitApi.getTodayOutfits();
        outfits = res.data?.data?.outfits || res.data?.outfits || res.data || [];
      } catch (e) {
        if (e.response?.status === 404) {
          const res = await outfitApi.generateOutfits({ occasion: 'casual' });
          outfits = res.data?.data?.outfits || res.data?.outfits || res.data || [];
        } else {
          throw e;
        }
      }
      setRecommendations(Array.isArray(outfits) ? outfits : [outfits]);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const surprise = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await outfitApi.getSurpriseOutfit();
      const outfit = res.data?.data?.outfit || res.data?.outfit || res.data;
      setRecommendations(outfit ? [outfit] : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { recommendations, loading, error, generate, fetchToday, surprise, setRecommendations };
};
