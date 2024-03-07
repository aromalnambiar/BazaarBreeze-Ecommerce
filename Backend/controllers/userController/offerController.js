const Offer = require('../../models/Offer');
const Product = require('../../models/Products');

const getAllOffers = async (req, res) => {
    try {
      const offers = await Offer.find();
      res.status(200).json({ message: 'Success', offers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getProductDetailsWithOffer = async (req, res) => {
    try {
      const productId = req.params.productId;
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const productOffers = await Offer.find({
        $or: [
          { productId: productId },
          { categoryId: product.category },
        ],
        validUntil: { $gte: new Date() },
        isActive: true,
      });
  
      let highestDiscountOffer = null;
      let highestDiscountValue = 0;
  
      productOffers.forEach((offer) => {
        if (offer.discountType === 'FixedAmount') {
          if (offer.discountValue > highestDiscountValue) {
            highestDiscountOffer = offer;
            highestDiscountValue = offer.discountValue;
          }
        }
        else if (offer.discountType === 'Percentage') {
          const discountValue = (product.regularPrice * offer.discountValue) / 100;
          if (discountValue > highestDiscountValue) {
            highestDiscountOffer = offer;
            highestDiscountValue = discountValue;
          }
        } 
      });
  
      res.status(200).json({
        highestDiscountOffer: highestDiscountOffer,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  


  module.exports = {
    getAllOffers,
    getProductDetailsWithOffer
  };
  