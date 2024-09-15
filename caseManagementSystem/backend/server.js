const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); 
const socketIo = require('socket.io'); 
const path = require('path');
const app = express();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const caseRoutes = require('./routes/caseRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const { protect } = require('./middleware/authMiddleware');
app.use(cors());

const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
}); 

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json());

//connect to mongoDB server
mongoose.connect("mongodb+srv://shrunkslinky:zd8ahxlgfCtgQCKD@cluster0.yg82kew.mongodb.net/MainDB")
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving static files from:', path.join(__dirname, 'uploads'));


app.use('/api/cases', protect, caseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', protect, studentRoutes);
app.use('/api/comments', protect, commentRoutes); // Use comment routes


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Initialize socket.io
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
