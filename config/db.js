const mongoose = require('mongoose');


const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;