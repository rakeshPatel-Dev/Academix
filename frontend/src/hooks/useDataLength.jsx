// hooks/useFetchMultipleApis.js
import { useState, useEffect } from "react";

const useFetchMultipleApis = (urls) => {
  const [totals, setTotals] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all APIs in parallel
        const responses = await Promise.all(
          Object.entries(urls).map(([name, url]) =>
            fetch(url)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
              })
              .then((json) => {
                // Extract total based on your API response structure
                // Assuming each API returns { total: number } or has a total field
                const total = json.total || json.count || 0;
                return { name, total, apiData: json };
              })
          )
        );

        // Convert array to object for totals
        const newTotals = responses.reduce((acc, { name, total }) => {
          acc[name] = total;
          return acc;
        }, {});

        // Store full API responses
        const allData = responses.map(({ name, apiData }) => ({
          name,
          ...apiData,
        }));

        setTotals(newTotals);
        setData(allData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (urls && Object.keys(urls).length > 0) {
      fetchAllData();
    }
  }, []);

  return { totals, data, loading, error };
};

export default useFetchMultipleApis;