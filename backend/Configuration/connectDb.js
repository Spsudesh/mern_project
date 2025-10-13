const dotenv = require("dotenv"); 
dotenv.config();
const url = process.env.DB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const mongoose = require("mongoose"); 
const connectDb = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error('Connection to MongoDB failed:', error);
    } 
};
module.exports = connectDb;