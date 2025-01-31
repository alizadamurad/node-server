const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const userDB = await mongoose.createConnection(process.env.MONGO_DB_URL)

        const cryptoDB = mongoose.createConnection(process.env.MONGO_CRYPTO_URL)
        console.log('MongoDB Connected');

        module.exports = {
            userDB: mongoose.connection,
            cryptoDB: cryptoConnection,
        };
        return { userDB, cryptoDB };
    } catch (error) {
        console.error('MongoDB Connection Error:', error)
    }

}
module.exports = connectDB;