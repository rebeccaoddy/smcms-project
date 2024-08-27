import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema({
    id: Number,
    firstname: String,
    lastname: String,
    gender: String,
    weeklyselfstudyhours: Number,
    careeraspiration: String,
    math_score: Number,
    history: Number,
    physics: Number,
    chemistry: Number,
    biology: Number,
    english: Number,
    geography: Number
});

// Static method to calculate averages
FacultySchema.statics.calculateAverages = async function() {
    const averages = await this.aggregate([
        {
            $group: {
                _id: null,
                math_score: { $avg: "$math_score" },
                history: { $avg: "$history_score" },
                physics: { $avg: "$physics_score" },
                chemistry: { $avg: "$chemistry_score" },
                biology: { $avg: "$biology_score" },
                english: { $avg: "$english_score" },
                geography: { $avg: "$geography_score" }
            }
        }
    ]);
    return averages[0] || {}; // Return the averages or an empty object if no data
};

const FacModel = mongoose.model('faculties', FacultySchema);

export default FacModel;