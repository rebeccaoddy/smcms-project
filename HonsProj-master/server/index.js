import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';

import bodyParser from 'body-parser';
import http from 'http';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import UserModel from './models/UserModel.js';
import TestModel from './models/testmodel.js';
import StudentModel from './models/StudentModel.js';
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

app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true
 }));
 
 app.use(bodyParser.json()); 

mongoose.connect("mongodb://127.0.0.1:27017/NewDB")

 
app.get('/getCourses', (req, res) => {
   CourseModel.find()
   .then(courseData => res.json(courseData))
   .catch(err => res.json(err))   
})

app.get('/getNewStudents', (req, res) => {
   NewStudentModel.find()
   .then(NewstudentData => res.json(NewstudentData))
   .catch(err => res.json(err))   
})

app.get('/getFacu', (req, res) => {
   FacultyModel.find()
   .then(FDATA => res.json(FDATA))
   .catch(err => res.json(err))   
})


app.get('/getPrograms', (req, res) => {
   ProgramModel.find()
   .then(programData => res.json(programData))
   .catch(err => res.json(err))   
})







const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Application 1 server running on http://localhost:${PORT}`);
});