const Wallet = require('../../models/Wallet'); // Update the path as needed
const Transaction = require('../../models/Transaction'); // Update the path as needed

const getWalletHistory = async (req, res) => {
  try {
    const {userId} = req.user;

    const wallet = await Wallet.findOne({ user: userId }).populate('transactions');

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found for the user' });
    }

    const history = wallet.transactions.map((transaction) => ({
      type: transaction.type,
      date: transaction.createdAt,
      amount: transaction.amount,
    }));

    // Return wallet history and balance
    res.status(200).json({ history, balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getWalletHistory };
