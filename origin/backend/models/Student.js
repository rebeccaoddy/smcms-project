const mongoose = require('mongoose');
const { stringify } = require('qs');

// const StudentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   studentNumber: { type: String },
//   degree: { type: String },
//   mark: { type: Number },
// });

const StudentSchema = new mongoose.Schema({
  CampusID: String,
  BirthDate: Date,
  PopulationGrp: String,
  Gender: String,
  AcademicPlanCode: String,
  AdmitTerm: String,
  NBTALScore: String,
  NBTMathScore: String,
  NBTQLScore: String,
  FacultyScores: String,
  HSResults: {
    FAScholarshipScore: String,
    EngGrd12FinRslt: String,
    MathGrd12FinRslt: String,
    PhySciGrd12FinRslt: String,
  },
  Years: Map,
  RiskLevel: String,
  RiskPoints: Number,
});

module.exports = mongoose.model('Student', StudentSchema);
