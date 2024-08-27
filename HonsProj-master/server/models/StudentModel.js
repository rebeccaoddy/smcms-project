import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    biography: {
        age: {
            type: Number,
            required: true
        },
        ethnicity: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        }
    },
    grades: {
        type: Object,
        required: true
    },
    gpas: {
        type: Object,
        required: true
    }
});

const StudentModel = mongoose.model('students', studentSchema);

export default StudentModel;