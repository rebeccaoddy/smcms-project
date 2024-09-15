// cutom hook to search the databse for students as users (common functionality)
import { useState, useEffect } from 'react';
import axios from 'axios';

const useSearch = (query, endpoint) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      console.log('Query as typed:', query); // Check the query value; testing
      const search = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5001/api/${endpoint}/search?query=${query}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setResults(response.data);
          console.log('Results returned:', response.data); // Check the results returned; testing

        } catch (error) {
          console.error(`Error searching ${endpoint}`, error); //error handling 
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
