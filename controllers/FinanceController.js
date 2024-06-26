const DepositModel = require('../models/DepositModel');
const UserModel = require('../models/UserModel');
const WithdrawModel = require('../models/WithdrwalModel');

const Deposit = async (req, res) => {
    const { owner, depositamount, phone } = req.body;

    try {
        // Parse depositamount to ensure it's a number
        const amountToDeposit = parseFloat(depositamount);
        if (isNaN(amountToDeposit) || amountToDeposit === 0) {
            return res.status(400).json({ error: 'Invalid deposit amount' });
        }

        // Find the user by ID and update the amount
        const user = await UserModel.findById(owner);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (amountToDeposit > 10000) {
            res.json({ message: "Max Deposit amount is 10000." });
        } else {
            user.amount = (user.amount || 0) + amountToDeposit;
            await user.save();

            // Create a new deposit record
            const depositDoc = await DepositModel.create({
                owner,
                depositamount: amountToDeposit,
                phone
            });

            res.status(200).json({ message: `Successfully deposited KES ${depositDoc.depositamount}.`, deposit: depositDoc });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error depositing money', details: error.message });
    }
};

const Withdraw = async (req, res) => {
    const { owner, withdrawamount, phone } = req.body;

    try {
        // Parse depositamount to ensure it's a number
        const amountToWithdraw = parseFloat(withdrawamount);
        if (isNaN(amountToWithdraw) || amountToWithdraw === 0) {
            return res.status(400).json({ error: 'Invalid withdraw amount' });
        }

        // Find the user by ID and update the amount
        const user = await UserModel.findById(owner);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.amount < amountToWithdraw) {
            res.status(402).json({ message: "You have Insufficient funds." });
        } else if (amountToWithdraw > 5000) {
            res.json({ message: "Max Withdrawal amount is 5000." });
        } else {
            user.amount = (user.amount || 0) - amountToWithdraw;
            await user.save();

            // Create a new deposit record
            const withdrawDoc = await WithdrawModel.create({
                owner,
                withdrawamount: amountToWithdraw,
                phone
            });

            res.status(200).json({ message: `Successfully withdrawn KES ${withdrawDoc.withdrawamount}.`, withdrawal: withdrawDoc });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error withdrawing money', details: error.message });
    }
};

module.exports = {
    Deposit,
    Withdraw
};