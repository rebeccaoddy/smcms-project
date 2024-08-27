import { Label } from '@mui/icons-material';
import axios from 'axios';

export const getFacultyData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/getFacu');
            
            // You can return both the averages and the formatted chart data
            return response.data;

        } catch (error) {
            console.error('Error fetching faculty averages:', error);
            throw error;
        }
};
