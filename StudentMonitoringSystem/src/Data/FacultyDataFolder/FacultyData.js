import axios from 'axios';

// Function to fetch faculty data from the API
export const getFacultyData = async () => {
    try {
        // Make a GET request to the specified endpoint to retrieve faculty data
        const response = await axios.get('http://localhost:8000/getFacu');
        
        // Return the data from the response
        return response.data;
    } catch (error) {
        // Log any errors that occur during the request for debugging purposes
        console.error('Error fetching faculty averages:', error);
        
        // Rethrow the error to ensure it can be handled by the caller or higher-level error handling
        throw error;
    }
};
