const Offer = require('../../models/Offer');

const getAllOffers = async (req, res) => {
    try {
      const offers = await Offer.find();
      res.status(200).json({ message: 'Success', offers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  module.exports = {
    getAllOffers
  };
  