const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const DashboardRoute = require('./routes/DashboardRoute');
const UserRoutes = require('./routes/UserRoutes');
const FinanceRoutes = require('./routes/FinanceRoutes');

const app = express();

PORT = process.env.PORT || 8080;

const connect = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MONGODB!!!');
    })
}

// Middleware
app.use(cors({
    credentials: true,
    methods: ['POST', 'GET'],
    origin: ['http://localhost:5173'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/dashboard', DashboardRoute);
app.use('/user', UserRoutes);
app.use('/finance', FinanceRoutes);


app.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`);
})
