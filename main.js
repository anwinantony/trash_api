const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { Schema } = mongoose;

const app = express();

// Set up database connection
const url = 'mongodb+srv://eldhopaulose0485:xyzel_025@cluster0.4sjqm.mongodb.net/Trash?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Define user schema
const userSchema = new Schema({
  username: { type: String, unique: true },
  points: { type: Number, default: 0 },
});

// Define user model
const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const user = new User({ username });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ detail: 'Username already exists' });
    } else {
      res.status(500).json({ detail: 'Internal Server Error' });
    }
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ detail: 'Invalid username' });
    }
  } catch (error) {
    res.status(500).json({ detail: 'Internal Server Error' });
  }
});

app.post('/add-points', async (req, res) => {
  try {
    const { username, points } = req.body;
    const user = await User.findOneAndUpdate({ username }, { $inc: { points } }, { new: true });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ detail: 'Failed to update points' });
    }
  } catch (error) {
    res.status(500).json({ detail: 'Internal Server Error' });
  }
});

app.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ detail: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ detail: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
