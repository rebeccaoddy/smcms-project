import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    DoB: String,
    ethnicity: String,
    gender: String,
    gpa: Number,
    state: String,
    age: Number,
    generation: String
});
const UserModel = mongoose.model('users', userSchema);

export default UserModel;