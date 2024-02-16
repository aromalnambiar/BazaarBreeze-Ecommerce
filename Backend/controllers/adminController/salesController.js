const Order = require('../../models/Order');
const moment = require('moment');

const generateSalesReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // console.log("generateSales query : ",req.query);
      console.log("startDate : ",startDate);
      console.log("startDate Moment : ",moment(startDate).startOf('day'));
  
      const startDateTime = startDate ? moment(startDate).startOf('day') : moment().startOf('day');
      const endDateTime = endDate ? moment(endDate).endOf('day') : moment().endOf('day');

      console.log("startDateTime : ",startDateTime);
      console.log("endDateTime : ",endDateTime);
  
      const orders = await Order.find({
        orderDate: {
          $gte: startDateTime,
          $lte: endDateTime,
        },
      });

      
  
    
  
      res.status(200).json({
        success: true,
        message: 'Sales report generated successfully',
        data: orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };
  const getSalesReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
    
      const parsedStartDate = startDate ? moment(startDate) : moment(0);
      const parsedEndDate = endDate ? moment(endDate) : moment();   
    
      if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
  
    
      const matchCriteria = {
        orderDate: {
          $gte: parsedStartDate.toDate(),
          $lte: parsedEndDate.toDate(),
        },
      };
  
    
      const result = await Order.aggregate([
        {
          $match: matchCriteria,
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
            },
            numberOfOrders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
            cancelledOrders: {
              $sum: {
                $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0],
              },
            },
          },
        },
        {
          $sort: {
            _id: 1, 
          },
        },
      ]);
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const showDiscountAndCoupons = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const startDateTime = startDate ? moment(startDate).startOf('day') : moment().startOf('day');
      const endDateTime = endDate ? moment(endDate).endOf('day') : moment().endOf('day');
  
      const orders = await Order.find({
        orderDate: {
          $gte: startDateTime,
          $lte: endDateTime,
        },
      });
  
      let totalDiscount = 0;
      let couponsDeduction = 0;
  
      // Calculate total discount and coupons deduction from orders
      orders.forEach(order => {
        order.coupons.forEach(async couponId => {
          const coupon = await Coupon.findById(couponId);
          if (coupon && coupon.isActive && moment().isBetween(coupon.validFrom, coupon.validUntil)) {
            couponsDeduction += coupon.discountValue;
          }
        });
  
        order.offers.forEach(async offerId => {
          const offer = await Offer.findById(offerId);
          if (offer && offer.isActive && moment().isBetween(offer.validFrom, offer.validUntil)) {
            if (offer.discountType === 'Percentage') {
              totalDiscount += (order.totalAmount * offer.discountValue) / 100;
            } else {
              totalDiscount += offer.discountValue;
            }
          }
        });
      });
  
      res.status(200).json({
        success: true,
        message: 'Discount and Coupons details retrieved successfully',
        data: {
          totalDiscount,
          couponsDeduction,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

 const getOverallSalesCount = async (req, res) => {
    try {
      const orders = await Order.find();
  
      const overallSalesCount = orders.length;
  
      res.status(200).json({
        success: true,
        message: 'Overall Sales Count retrieved successfully',
        count: overallSalesCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  };

  const getOverallOrderAmount = async (req, res) => {
    try {
      // Use the aggregate method to calculate the total order amount
      const result = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);
  
      // Check if there is any result
      if (result.length > 0) {
        res.status(200).json({ totalAmount: result[0].totalAmount });
      } else {
        res.status(404).json({ message: 'No orders found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getOverallSalesCountAndAmount = async (req, res) => {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            orderStatus: { $in: ['Processing', 'Shipped', 'Delivered'] },
          },
        },
        {
          $group: {
            _id: null,
            totalSalesCount: { $sum: 1 },
            totalOrderAmount: { $sum: '$totalAmount' },
          },
        },
      ]);
  
      if (result.length > 0) {
        const { totalSalesCount, totalOrderAmount } = result[0];
        res.status(200).json({ totalSalesCount, totalOrderAmount });
      } else {
        res.status(200).json({ totalSalesCount: 0, totalOrderAmount: 0 });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

//   getOverallDiscount =  async (req, res) => {
//     try {
//       const orders = await Order.find();
  
//       // Calculate overall discount from orders
  
//       res.status(200).json({
//         success: true,
//         message: 'Overall Discount retrieved successfully',
//         data: overallDiscount,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         success: false,
//         message: 'Internal Server Error',
//       });
//     }
//   };


// downloadSalesReport = async (req, res) => {
//   try {
//     const { format } = req.params;
    
//   

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//     });
//   }
// };

module.exports={
    generateSalesReport,
    getOverallOrderAmount,
    getOverallSalesCount,
    getSalesReport,
    getOverallSalesCountAndAmount
}