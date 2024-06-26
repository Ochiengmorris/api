const mongoose = require('mongoose');
const { Schema } = mongoose;

const DepositSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    depositamount: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Export the model
const Deposit = mongoose.model('Deposit', DepositSchema);
module.exports = Deposit;