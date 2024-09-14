import { useState, useEffect } from 'react';
import axios from 'axios';

const useSearch = (query, endpoint) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      console.log('Query from useSearch.js:', query); // Check the query value
      const search = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/${endpoint}/search?query=${query}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setResults(response.data);
          console.log('Results from useSearch.js:', response.data); // Check the results returned

        } catch (error) {
          console.error(`Error searching ${endpoint}`, error);
        }
      };

      search();
    } else {
      setResults([]);
    }
  }, [query, endpoint]);

  return results;
};

export default useSearch;
