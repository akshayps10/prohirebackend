const Job = require('./models/job'); // Import Job model

// Create a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, department, tillDate } = req.body;
    if (!title || !department || !tillDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newJob = new Job({ title, department, tillDate });
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
});
