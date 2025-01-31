const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)

        const cryptoConnection = mongoose.createConnection(process.env.MONGO_CRYPTO_URL)
        console.log('MongoDB Connected');

        module.exports = {
            userDB: mongoose.connection,
            cryptoDB: cryptoConnection,
        };
    } catch (error) {
        console.error('MongoDB Connection Error:', error)
    }

}
// module.exports = { userDB: mongoose.connection, cryptoDB: cryptoConnection }