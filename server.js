const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://jaymindangariya:Jaymin12@cluster0.47ato.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Signup API
app.post('/api/signup', async (req, res) => {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !phone || !address || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "Email already registered!" });
    }

    const newUser = new User({ name, email, phone, address, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
});

// Login API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "No user found with this email!" });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password!" });
    }

    res.status(200).json({ message: "Login successful!" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
