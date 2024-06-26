const UserModel = require('../models/UserModel');
const WithdrawModel = require('../models/WithdrwalModel');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const salt = bcrypt.genSaltSync(12);

const RegisterUser = async (req, res) => {
    const {
        username, firstname,
        lastname, email,
        phone, password, upline1,
    } = req.body;

    try {
        const isReferer = await UserModel.findOne({ username: upline1 });
        if (isReferer) {
            try {
                const userDoc = await UserModel.create({
                    username, firstname,
                    lastname, email,
                    phone, password: bcrypt.hashSync(password, salt),
                    upline1,
                });
                res.status(201).json({message: "Registration succesfull"});
            } catch (e) {
                if (e.code === 11000) {
                    // Duplicate key error
                    const field = Object.keys(e.keyPattern)[0];
                    const message = `The ${field} is already in use.`;
                    res.status(422).json({ message: message });
                } else {
                    res.status(422).json({ message: e.message });
                }
            }
        } else {
            res.status(422).json({ message: 'Referer is not valid!' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const userDoc = await UserModel.findOne({ email: email });
        if (userDoc) {
            const passGood = await bcrypt.compare(password, userDoc.password);
            if (passGood) {
                jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, { expiresIn: '24h' }, async (err, token) => {
                    if (err) {
                        throw err;
                    }
                    const userWithoutPassword = await UserModel.findById(userDoc._id).select('-password');
                    const isProduction = process.env.NODE_ENV === 'production';
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: 'strict',
                        maxAge: 24 * 60 * 60 * 1000
                    }).json(userWithoutPassword);
                });
            } else {
                res.status(422).json({ message: 'Invalid email or password!' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, { expiresIn: '24h' }, async (err, userData) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            try {
                const userDoc = await UserModel.findById(userData.id).select('-password');
                const userId = userData.id;

                const userObjectId = new ObjectId(userId);

                // Use the aggregate method to sum withdrawals for the user
                const result = await WithdrawModel.aggregate([
                    { $match: { owner: userObjectId } }, // Match documents with the user ID
                    { $group: { _id: null, totalWithdrawals: { $sum: '$withdrawamount' } } } // Group and sum the amounts
                ]);

                // Check if result is empty
                const totalWithdrawals = result.length > 0 ? result[0].totalWithdrawals : 0;

                const userProfile = {
                    ...userDoc.toObject(), // Convert Mongoose document to plain object
                    totalWithdrawals
                };
                res.json(userProfile);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        })
    } else {
            res.status(401).json({ message: 'No token provided' });
    }
};
const UpdateProfile = async (req, res) => {
    const { email, firstname, lastname, phone } = req.body;
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const userDoc = await UserModel.findById(userData.id);
            if (!userDoc) {
                return res.status(404).json({ message: 'User not found' });
            }

            userDoc.email = email;
            userDoc.firstname = firstname;
            userDoc.lastname = lastname;
            userDoc.phone = phone;
            await userDoc.save();

            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}


const LogOutUser = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 0,
    }).json({ message: 'Logged out' });
};

module.exports = {
    RegisterUser,
    LoginUser,
    getUserProfile,
    LogOutUser,
    UpdateProfile
}
