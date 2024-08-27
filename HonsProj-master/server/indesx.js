/*const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/Test')

const schema = new mongoose.Schema({
   id : Number,
   firstName : String,
   lastName : String,
   DoB : String,
   ethnicity: String,
   gender : String,
   gpa : String,
   state : String,
   age : Number

})

const UserModel = mongoose.model("Users", schema)


// Middleware to parse JSON
app.use(express.json());

// Route to get all users
app.get('/Users', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(3001, () => {
    console.log('running')
})*/
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Define a schema and model for Users
const userSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  dob: String,
  ethnicity: String,
  gender: String,
  gpa: String,
  state: String,
  age: Number,
});

const UserModel = mongoose.model('Users', userSchema);

// Route to get all users
app.get('/getUsers', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});