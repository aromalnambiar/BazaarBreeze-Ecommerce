const Coupon = require('../../models/Coupon');

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      isActive,
      couponName,
      description,
      validProducts,
    } = req.body;

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      isActive,
      couponName,
      description,
      validProducts,
    });

    const savedCoupon = await newCoupon.save();

    res.status(201).json({ message: 'Coupon created successfully', coupon: savedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.status(200).json({ message: 'Success', coupons });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCouponById = async (req, res) => {
    try {
      const { couponId } = req.params;
      const coupon = await Coupon.findById(couponId);
      
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Success', coupon });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
const updateCouponById = async (req, res) => {
    try {
      const { couponId } = req.params;
      const updateData = req.body;
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, { new: true });
  
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  
const deleteCouponById = async (req, res) => {
    try {
      const { couponId } = req.params;
      const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
  
      if (!deletedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

  
module.exports={
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCouponById,
    deleteCouponById
}