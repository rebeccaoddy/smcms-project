import axios from 'axios';

// Function to fetch new students from the API
export const getNewStudents = async () => {
    try {
        // Make a GET request to the specified endpoint to retrieve new students data
        const response = await axios.get('http://localhost:8000/getNewStudents');
        
        // Return the data from the response
        return response.data;
    } catch (error) {
        // Log any errors that occur during the request
        console.error('Error fetching students:', error);
        
        // Rethrow the error to be handled by the caller
        throw error;
    }
};
