require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 27017;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
});
const User = mongoose.model('User', userSchema);

// Crypto Schema
mongoose.connection.useDb('prices'); // Use separate DB for crypto prices
const cryptoSchema = new mongoose.Schema({
    type: String,
    code: String,
    changeDaystr: String,
    name: String,
    pricestr: String,
});
const Crypto = mongoose.model('Crypto', cryptoSchema);

// Routes
app.get('/', (req, res) => res.send('API Running'));

// User Routes
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/users/:phone', async (req, res) => {
    const user = await User.findOne({ phone: req.params.phone });
    res.json(user);
});

app.put('/users/:phone', async (req, res) => {
    const updatedUser = await User.findOneAndUpdate(
        { phone: req.params.phone },
        req.body,
        { new: true }
    );
    res.json(updatedUser);
});

// Crypto Routes
app.get('/crypto', async (req, res) => {
    const cryptoData = await Crypto.find();
    res.json(cryptoData);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
