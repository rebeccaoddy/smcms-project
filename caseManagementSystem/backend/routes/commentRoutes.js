const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get comments for a case
router.get('/:caseId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ caseId: req.params.caseId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a case
router.post('/:caseId', protect, async (req, res) => {
  const { text } = req.body;

  try {
    const newComment = new Comment({
      caseId: req.params.caseId,
      user: req.user.username,
      text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
