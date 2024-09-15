const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  dateCreated: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Reference to Student model
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true },
  notes: { type: String, required: true },
  createdBy: { type: String, required: true },
  category: { type: String, required: true },
  attachments: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      //uploadedAt: { type: Date, default: Date.now }
    }
  ],
});

module.exports = mongoose.model('Case', CaseSchema);
