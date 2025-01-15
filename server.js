const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const upload = require('./middleware/multer.js');

// Assuming you have a User model already defined
const UserMain = require('./models/user.js');
const User = UserMain.UserModel;
const Candidate= UserMain.CandidateModel;

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// sign up route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


  
// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare the password (plain text)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1h', // Token validity
    });

    // Send the response
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});   





// Route to create a new candidate
app.post('/candidates', upload.fields([{ name: 'profilePicture' }, { name: 'resume' }]), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, appliedPosition, isFresher } = req.body;
    console.log("called candidate", req.body);
    const newCandidate = new Candidate({
      firstName,
      lastName,
      email,
      phoneNo,
      appliedPosition,
      isFresher,
      profilePicture: req.files['profilePicture'] ? req.files['profilePicture'][0].path : null,
      resume: req.files['resume'] ? req.files['resume'][0].path : null,
    });

    await newCandidate.save();
    res.status(201).json({ message: 'Candidate created successfully', candidate: newCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating candidate', error });
  }
});


// Route to get all candidates
app.get('/candidates', async (req,res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error });
  }
});

// Route to get a single candidate by ID
app.get('/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate', error });
  }
});

// Route to update a candidate by ID
app.put('/candidates/:id', upload.fields([{ name: 'profilePicture' }, { name: 'resume' }]), async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.files['profilePicture']) {
      updatedData.profilePicture = req.files['profilePicture'][0].path;
    }

    if (req.files['resume']) {
      updatedData.resume = req.files['resume'][0].path;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedCandidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate updated successfully', candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error });
  }
});

// Route to delete a candidate by ID
app.delete('/candidates/:id', async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!deletedCandidate) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate deleted successfully', candidate: deletedCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error });
  }
});



// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
