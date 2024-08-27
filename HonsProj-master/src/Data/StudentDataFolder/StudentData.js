import { Label } from '@mui/icons-material';
import axios from 'axios';

export const getStudents = async () => {
    try {
        const response = await axios.get('http://localhost:8000/getStudents');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const getNewStudents = async () => {
    try {
        const response = await axios.get('http://localhost:8000/getNewStudents');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8000/getStudent/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
};