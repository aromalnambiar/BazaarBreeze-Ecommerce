const User = require('../../models/User');
const Coupon = require('../../models/Coupon');


const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        console.log("coupon code : ",couponCode);

        // Find the coupon in the database
        const coupon = await Coupon.findOne({ code: couponCode });
    
        if (!coupon) {
          return res.status(404).json({ message: 'Invalid coupon code' });
        }
    
        // Validate coupon conditions
        if (!coupon.isActive) {
          return res.status(400).json({ message: 'Coupon is not active' });
        }
    
        const currentDate = new Date();
        if (currentDate < coupon.validFrom || currentDate > coupon.validUntil) {
          return res.status(400).json({ error: 'Coupon is not valid at this time' });
        }
    
        if (coupon.usageLimit !== null && coupon.usageLimit <= 0) {
          return res.status(400).json({ message: 'Coupon has reached its usage limit' });
        }

      res.status(200).json({
        success: true,
        couponId:coupon._id,
        message: 'Coupon applied successfully',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      });

    } catch (error) {
        
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error applying coupon',
      });
      
    }
  };

const removeCoupon = async (req, res) => {
    try {
      const { userId } = req.user; // Assuming you have user information in req.user
      const { couponId } = req.params;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the coupon exists
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
  
      // Remove the coupon from the user's appliedCoupons array
      user.appliedCoupons = user.appliedCoupons.filter((appliedCoupon) => appliedCoupon.toString() !== couponId);
      await user.save();
  
      res.status(200).json({ message: 'Coupon removed successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getAllValidCoupons = async (req, res) => {
    try {
      const currentDate = new Date();
  
      const validCoupons = await Coupon.find({
        validFrom: { $lte: currentDate },
        validUntil: { $gte: currentDate },
        isActive: true,
        $or: [
          { usageLimit: null }, // No usage limit
          { usageLimit: { $gt: 0 } }, // Usage limit greater than 0
        ],
      });
  
      res.status(200).json(validCoupons);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports={
    applyCoupon,
    removeCoupon,
    getAllValidCoupons
}
