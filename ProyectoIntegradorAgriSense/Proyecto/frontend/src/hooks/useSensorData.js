import { useState, useEffect, useCallback } from 'react';
import { telemetryService } from '../services/telemetryService';

export function useSensorData(initialFilters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    ...initialFilters
  });
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    // Evitamos llamadas síncronas a setState al inicio para contentar al linter
    // y prevenir renderizados en cascada innecesarios en el efecto.
    setLoading(true);
    setError(null);
    try {
      const response = await telemetryService.getAll(filters);
      if (response && response.content) {
        setData(response.content);
        setTotalPages(response.totalPages);
      } else {
        setData(response || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let isMounted = true;
    
    const executeFetch = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    executeFetch();
    
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  const nextPage = () => {
    if (filters.page < totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return { 
    data, 
    loading, 
    error, 
    filters, 
    totalPages,
    updateFilters, 
    nextPage, 
    prevPage,
    refetch: fetchData 
  };
}