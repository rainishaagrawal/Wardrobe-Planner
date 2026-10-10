import { useState, useCallback } from 'react';
import * as feedbackApi from '../services/feedbackApi';
import { getApiErrorMessage } from '../services/api';

export const useOutfitFeedback = (outfitId, initialFeedback = null) => {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const submitFeedback = useCallback(async (rating, comment = '', context = {}) => {
    setLoading(true); setError(''); setSuccessMsg('');
    const prevFeedback = feedback;
    
    // Optimistic UI update
    setFeedback({ rating, comment, outfit: outfitId });
    
    try {
      const res = await feedbackApi.createOutfitFeedback(outfitId, { rating, comment, context, type: 'outfit' });
      const savedFeedback = res.data?.data?.feedback || res.data?.feedback || res.data;
      setFeedback(savedFeedback);
      setSuccessMsg("Got it — I'll keep that in mind.");
    } catch (err) {
      setFeedback(prevFeedback); // Revert
      setError(getApiErrorMessage(err) || "Your feedback couldn't be saved. Try again.");
    } finally {
      setLoading(false);
    }
  }, [outfitId, feedback]);

  return { feedback, loading, error, successMsg, submitFeedback, setFeedback };
};
