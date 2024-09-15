import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import bodyParser from 'body-parser';
import http from 'http';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import CourseModel from './models/CourseModel.js';
import NewStudentModel from './models/NewStudentModel.js';
import ProgramModel from './models/ProgramModel.js';
import FacultyModel from './models/FacultyModel.js';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure CORS settings to allow requests from specific origins and methods
app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true
 }));
 
 app.use(bodyParser.json()); 

 // Connect to MongoDB Atlas using Mongoose
 mongoose.connect("mongodb+srv://shrunkslinky:zd8ahxlgfCtgQCKD@cluster0.yg82kew.mongodb.net/MainDB")
 .then(() => console.log('Connected to MongoDB Atlas'))
 .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

 // Define a route to handle GET requests for course data
app.get('/getCourses', (req, res) => {
   CourseModel.find()
   .then(courseData => res.json(courseData))
   .catch(err => res.json(err))   
})

// Define a route to handle GET requests for new student data
app.get('/getNewStudents', (req, res) => {
   NewStudentModel.find()
   .then(NewstudentData => res.json(NewstudentData))
   .catch(err => res.json(err))   
})

// Define a route to handle GET requests for faculty data
app.get('/getFacu', (req, res) => {
   FacultyModel.find()
   .then(FDATA => res.json(FDATA))
   .catch(err => res.json(err))   
})

// Define a route to handle GET requests for program data
app.get('/getPrograms', (req, res) => {
   ProgramModel.find()
   .then(programData => res.json(programData))
   .catch(err => res.json(err))   
})

// Start the Express application server and listen on the defined port
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Application 1 server running on http://localhost:${PORT}`);
});