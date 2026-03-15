// hooks/useFetchMultipleApis.js
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const useFetchMultipleApis = (urls) => {
  const [totals, setTotals] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAllData = async () => {
      // Don't fetch if not authenticated
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all APIs in parallel with credentials included
        const responses = await Promise.all(
          Object.entries(urls).map(async ([name, url]) => {
            try {
              const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Important: This sends cookies with the request
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              if (!response.ok) {
                if (response.status === 401) {
                  throw new Error('Unauthorized - Please log in again');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const json = await response.json();

              // Extract total based on your API response structure
              // Different possible response structures
              let total = 0;
              if (json.total) total = json.total;
              else if (json.count) total = json.count;
              else if (json.data?.total) total = json.data.total;
              else if (json.data?.length) total = json.data.length;
              else if (Array.isArray(json)) total = json.length;

              return {
                name,
                total,
                apiData: json
              };
            } catch (err) {
              console.error(`Error fetching ${name}:`, err);
              return {
                name,
                total: 0,
                apiData: null,
                error: err.message
              };
            }
          })
        );

        // Separate successful responses from errors
        const successfulResponses = responses.filter(r => !r.error);
        const failedResponses = responses.filter(r => r.error);

        // Convert array to object for totals
        const newTotals = successfulResponses.reduce((acc, { name, total }) => {
          acc[name] = total;
          return acc;
        }, {});

        // Store full API responses
        const allData = successfulResponses.map(({ name, apiData }) => ({
          name,
          ...apiData,
        }));

        setTotals(newTotals);
        setData(allData);

        // If there were any 401 errors, you might want to handle them
        if (failedResponses.some(r => r.error?.includes('Unauthorized'))) {
          setError('Session expired. Please log in again.');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (urls && Object.keys(urls).length > 0) {
      fetchAllData();
    }
  }, [isAuthenticated, urls]); // Add isAuthenticated as dependency

  return { totals, data, loading, error };
};

export default useFetchMultipleApis;