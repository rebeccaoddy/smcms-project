import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
    firstname: String,
});

const TestModel = mongoose.model('finals', TestSchema);

export default TestModel;