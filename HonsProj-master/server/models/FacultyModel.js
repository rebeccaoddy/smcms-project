import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    facultyName: {
        type: String,
        required: true,
        unique: true
    },
    numberOfStudents: {
        type: Object,
        required: true
    },
    marks: {
        type: Object,
        required: true
    },
    demographics: {
        genders: {
            type: Object,
            required: true
        },
        populationGroups: {
            type: Object,
            required: true
        }
    },
    gpa: {
        type: Object,
        required: true
    },
    risk_stats: {
        type: Object,
        required: true
    }
});

const FacultyModel = mongoose.model('newfaculties', facultySchema);

export default FacultyModel;
