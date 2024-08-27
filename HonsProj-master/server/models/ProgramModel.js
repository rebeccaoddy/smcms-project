import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
    ProgramCode: {
        type: String,
        required: true,
    },
    CourseCode: {
        type: [String], // Array of course codes
        required: true,
    },
    NumberOfStudents: {
        type: Object, // Object to hold student counts by year
        required: true,
    },
    Marks: {
        type: Object, // Object to hold marks organized by year
        required: true,
    },
    Genders: {
        type: Object, // Object to hold gender counts organized by year
        required: true,
    },
    PopulationGroups: {
        type: Object, // Object to hold population group counts organized by year
        required: true,
    },
    GPA: {
        type: Object, // Object to hold GPA organized by year
        required: true,
    },
    RiskStats: {
        type: Object,
        required: true
    }
});

const ProgramModel = mongoose.model('programs', programSchema);

export default ProgramModel;
