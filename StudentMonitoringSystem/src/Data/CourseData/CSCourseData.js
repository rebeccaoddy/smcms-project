import axios from 'axios';

export const getCourses = async () => {
    try {
        const response = await axios.get('http://localhost:8000/getCourses');
        return response.data; // Return the fetched course data
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error; // Throw the error to handle it in the calling code
    }
};




