const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./connectMongo'); // Import the connectDB function
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 27017;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB and get the connections
connectDB()
    .then((connections) => {
        const { userDB, cryptoDB } = connections;

        // Define models after connections are established
        // User Schema (for app_users database)
        const userSchema = new mongoose.Schema({
            fullName: String,
            email: String,
            phone: String,
        });
        const User = userDB.model('User', userSchema);

        // Crypto Schema (for prices database)
        const cryptoSchema = new mongoose.Schema({
            type: String,
            code: String,
            changeDaystr: String,
            name: String,
            pricestr: String,
        }, { collection: 'crypto_prices' }); // Explicitly specify the collection name

        const Crypto = cryptoDB.model('Crypto', cryptoSchema);

        // Get Crypto Data (Equivalent to getData in Dart)
        app.get('/crypto', async (req, res) => {
            try {
                const cryptoData = await Crypto.find();
                console.log('Crypto Data:', cryptoData); // Log the data
                res.json(cryptoData);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Insert User (Equivalent to insert in Dart)
        app.post('/users', async (req, res) => {
            try {
                const { fullName, email, phone } = req.body;

                // Check if user already exists
                const existingUser = await User.findOne({
                    $or: [{ email }, { phone }],
                });

                if (existingUser) {
                    return res.status(400).json({ error: 'User already exists' });
                }

                // Create a new user
                const newUser = new User({ fullName, email, phone });
                await newUser.save();

                res.status(201).json({ message: 'Data Inserted', user: newUser });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Check if User Exists (Equivalent to isExist in Dart)
        app.post('/users/check', async (req, res) => {
            try {
                const { email, phone } = req.body;

                const existingUser = await User.findOne({
                    $or: [{ email }, { phone }],
                });

                res.json({ exists: existingUser !== null });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get User by Phone Number (Equivalent to getUser in Dart)
        app.get('/users/:phone', async (req, res) => {
            try {
                const user = await User.findOne({ phone: req.params.phone });

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json(user);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Update User (Equivalent to updateUser in Dart)
        app.put('/users/:phone', async (req, res) => {
            try {
                const { newName, newEmail } = req.body;

                const updatedUser = await User.findOneAndUpdate(
                    { phone: req.params.phone },
                    { fullName: newName, email: newEmail },
                    { new: true } // Return the updated document
                );

                if (!updatedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({ success: true, user: updatedUser });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Start Server
        app.listen(PORT, () => {
            console.log("Server is running on port " + PORT);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process if the connection fails
    });
// const express = require('express');

// const app = express();

// require('dotenv').config()

// const connectDB = require("./connectMongo");
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const PORT = process.env.PORT || 27017;

// // // Middleware
// app.use(bodyParser.json());
// app.use(cors());


// let userDB, cryptoDB;

// connectDB().then((connection) => {
//     userDB = connection.userDB;
//     cryptoDB = connection.cryptoDB;
//     console.log('MongoDB connections established');

//     // User Schema
//     const userSchema = new mongoose.Schema({
//         fullName: String,
//         email: String,
//         phone: String,
//     });
//     const User = userDB.model('User', userSchema);

//     // Crypto Schema
//     const cryptoSchema = new mongoose.Schema({
//         type: String,
//         code: String,
//         changeDaystr: String,
//         name: String,
//         pricestr: String,
//     }, { collection: 'crypto_prices' });
//     const Crypto = cryptoDB.model('Crypto', cryptoSchema);

//     // Crypto Routes
//     app.get('/crypto_prices', async (req, res) => {
//         try {
//             const cryptoData = await Crypto.find();
//             console.log(cryptoData);
//             res.json(cryptoData);
//         }
//         catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     });

//     app.get('/users', async (req, res) => {
//         try {
//             const users = await User.find();
//             console.log(users);
//             res.json(users);
//         }

//         catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     });


//     app.listen(PORT, () => {
//         console.log("Server is running on port " + PORT);
//     });

// }).catch((error) => {
//     console.error('MongoDB Connection Error:', error);
//     process.exit(1);
// });
