const mongoose = require('mongoose');
const { Schema } = mongoose;

const WithdrawSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    withdrawamount: {
        type: Number,
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
const Withdraw = mongoose.model('Withdraw', WithdrawSchema);
module.exports = Withdraw;