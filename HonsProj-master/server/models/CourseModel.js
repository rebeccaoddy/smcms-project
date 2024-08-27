import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: {
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

const CourseModel = mongoose.model('newcourses', courseSchema);

export default CourseModel;