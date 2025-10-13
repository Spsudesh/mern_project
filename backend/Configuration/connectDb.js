const dotenv = require("dotenv"); 
dotenv.config();
const url = "mongodb+srv://sudeshpol:sudesh123@cluster0.yfeoeyb.mongodb.net/test";

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