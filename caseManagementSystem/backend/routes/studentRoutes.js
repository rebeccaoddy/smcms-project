const express = require('express');
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Search students by name (or object ID) in addCase feature [--> NOT student id]
router.get('/search', protect, async (req, res) => {
  const query = req.query.query;
  try {
    const students = await Student.find({
      CampusID: { $regex: query, $options: 'i' } // Searching by CampusID, case-insensitive
    }).select('_id CampusID Gender PopulationGrp'); // Select the fields you need in the response
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error searching students', error });
  }
});

// Get student cases by studentNumber ONLY for top panel student search
router.get('/:CampusID', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ CampusID: req.params.CampusID });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a student by ID
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student by ID
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
