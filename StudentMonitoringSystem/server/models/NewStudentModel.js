import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    CampusID: {
        type: String,
        required: true,
        unique: true
    },
    BirthDate: {
        type: Date,
        required: true
    },
    PopulationGrp: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    AcademicPlanCode: {
        type: String,
        required: true
    },
    AdmitTerm: {
        type: String,
        required: true
    },
    NBTALScore: {
        type: String,
        required: true
    },
    NBTMathScore: {
        type: String,
        required: true
    },
    NBTQLScore: {
        type: String,
        required: true
    },
    FacultyScores: {
        type: String,
        required: true
    },
    HSResults: {
        type: Object,
        required: true,
        
    },
    Years: {
        type: Object,
        required: true,
        
    },
    RiskLevel: {
        type: String,
        required: true
    },
    RiskPoints: {
        type: Number,
        required: true
    },
});

const NewStudentModel = mongoose.model('students', studentSchema);

export default NewStudentModel;
