const path = require('path');

const express = require('express');
const Case = require('../models/Case');
const Student = require('../models/Student'); 
const multer = require('multer');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Correctly resolve the path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


// Get all cases
router.get('/', protect, async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('student')// Populate student details
      .populate('assignedTo'); // Populate the assignedTo field with the username

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new case
router.post('/', protect, async (req, res) => {
  const newCase = new Case(req.body);
  try {
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Get cases by student number
router.get('/student/:CampusID', protect, async (req, res) => {
  
  try {
    const student = await Student.findOne({ CampusID: req.params.CampusID });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const cases = await Case.find({ student: student._id });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get a specific case by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const caseDetail = await Case.findById(req.params.id).populate('student');
    if (!caseDetail) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(caseDetail);
  } catch (error) {
    console.error('Error fetching case or student details:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update a case by ID
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(updatedCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




// Route to handle file uploads for a case
router.post('/:id/attachments', protect, upload.single('file'), async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseItem = await Case.findById(caseId);

    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Add the file information to the case's attachments array
    caseItem.attachments.push({ filename: file.filename, path: `/uploads/${file.filename}` });

    await caseItem.save();

    res.status(200).json({ message: 'File uploaded successfully', caseItem });
  } catch (error) {
    console.error('Error uploading file', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

// Delete case by ID
router.delete('/:id', protect, async (req, res) => {
  try {
    const caseId = req.params.id;

    console.log('Attempting to delete case with ID:', caseId); // Log the case ID
    const caseToDelete = await Case.findById(caseId);

    if (!caseToDelete) {
      console.log('Case not found:', caseId); // Log if the case isn't found
      return res.status(404).json({ message: 'Case not found' });
    }

    await Case.findByIdAndDelete(caseId);
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error); // Log detailed error information
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
