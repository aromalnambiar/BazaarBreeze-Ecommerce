const Offer = require('../../models/Offer');
const ProductModel = require('../../models/Products');

// Create a new offer
const createOffer = async (req, res) => {
  try {
    // Destructure relevant fields from req.body
    const { discountType, discountValue, validFrom, validUntil, isActive, description, offerType, selectedCategories, selectedProducts } = req.body;

    // Create a new Offer instance
    const newOffer = new Offer({
      discountType,
      discountValue,
      validFrom,
      validUntil,
      isActive,
      description,
      offerType,
      // Populate productId and categoryId arrays based on offerType
      productId: offerType === 'Product' ? selectedProducts : [],
      categoryId: offerType === 'Category' ? selectedCategories : [],
    });

    // Save the newOffer to the database
    const savedOffer = await newOffer.save();

    res.status(201).json({ message: 'Offer created successfully', offer: savedOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'I nternal Server Error' });
  }
};


// Get all offers
const getAllOffers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalOffers = await Offer.countDocuments();
    const offers = await Offer.find().skip(startIndex).limit(limit);

    res.status(200).json({ message: 'Success', offers, totalOffers });
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

const updateOfferStatus= async (req, res) => {
  const { Id } = req.params;

  try {
    const offer = await Offer.findById(Id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Toggle the isActive status
    const updatedOffer = await Offer.findByIdAndUpdate(
      Id,
      { $set: { isActive: !offer.isActive } },
      { new: true }
    );

    return res.json(updatedOffer);
  } catch (error) {
    console.error('Error toggling isActive status:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
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
  updateOfferStatus,
};
