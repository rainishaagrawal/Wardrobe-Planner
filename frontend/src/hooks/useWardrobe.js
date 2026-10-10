import { useState, useCallback } from 'react';
import * as wardrobeApi from '../services/wardrobeApi';
import { getApiErrorMessage } from '../services/api';

export const useWardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState(null);

  const fetchWardrobe = useCallback(async (params = {}, append = false) => {
    setLoading(true);
    setError('');
    try {
      const res = await wardrobeApi.getWardrobe(params);
      setItems(prev => append ? [...prev, ...res.data.items] : res.data.items);
      setPagination(res.data.pagination);
      setStats({ total: res.data.pagination.totalItems }); // Fix total to totalItems
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, pagination, stats, fetchWardrobe, setItems };
};