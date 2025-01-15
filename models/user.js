const mongoose = require('mongoose');  

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Candidate Schema
const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  appliedPosition: { type: String, required: true },
  isFresher: { type: Boolean, default: false },
  profilePicture: { type: String }, // Store file paths
  resume: { type: String }, // Store file paths
});

// const CandidateModel = mongoose.model('Candidate', candidateSchema);

// Export both models
module.exports = {
  UserModel: mongoose.model('User', userSchema),
  CandidateModel: mongoose.model('Candidate', candidateSchema)
}
