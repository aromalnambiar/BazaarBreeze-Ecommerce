const Offer = require('../../models/Offer');

// Create a new offer
const createOffer = async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    const savedOffer = await newOffer.save();
    res.status(201).json({ message: 'Offer created successfully', offer: savedOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all offers
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json({ message: 'Success', offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get offer by ID
const getOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId);
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.status(200).json({ message: 'Success', offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update offer by ID
const updateOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;
    const updateData = req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, updateData, { new: true });

    if (!updatedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete offer by ID
const deleteOfferById = async (req, res) => {
  try {
    const { offerId } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(offerId);

    if (!deletedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOfferById,
  deleteOfferById,
};
