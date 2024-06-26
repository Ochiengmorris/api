const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,   // Automatically trims whitespace
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
    },
    upline1: {
        type: String,
        required: true,
        trim: true,
        default:'ADMIN',
    },
    package: {
        type: String,
        default: 'basic',
    },
    amount: {
        type: Number,
        default: 0,
    },
    isVerifiedAgent: {
        type: Boolean,
        default: false,
    },
    isVIP: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// Export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;