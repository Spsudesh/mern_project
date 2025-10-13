const express = require("express");
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoutes");
const petRoute = require("./routes/petRoutes");
const adoptionFormRoute = require("./routes/adoptionFormRoutes");
const contactFormRoute = require("./routes/contactFormRoutes");
const connectDb = require('./Configuration/connectDb');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5000;
const User = require('./models/userModel');
const fs = require('fs');
const path = require('path');

// Connect to the database
connectDb();

// Seed a default admin user if none exists
const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@hopesanctuary.local';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const adminUser = new User({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                phoneNumber: '0000000000',
                password: adminPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log(`Admin user created. Email: ${adminEmail} Password: ${adminPassword}`);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (e) {
        console.error('Failed to seed admin user:', e);
    }
};

seedAdmin();

const app = express();
// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/users", userRoute);
app.use("/api/pets", petRoute);
app.use("/api/adoption-forms", adoptionFormRoute);
app.use("/api/contact-forms", contactFormRoute);

app.listen(port, '0.0.0.0', (er) => {
    if (er) {
        console.log(er);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});