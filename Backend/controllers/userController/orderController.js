const Order=require('../../models/Order');
const ProductVariant=require('../../models/ProductVariant');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Wallet=require("../../models/Wallet");
const Transaction=require("../../models/Transaction");

const showOrders = async (req, res) => {
    try {
      const { userId } = req.user;
      console.log("user id ",userId);
      const orders = await Order.find({ userId });
  
      if (!orders || orders.length === 0) {
        return res.status(400).json({ message: "No orders found" });
      }
  
      res.status(200).json({ message: "Success", orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
const addOrder = async (req, res) => {
    try {
      console.log("Inside addOrder1");
      const {
        orderedItems,
        paymentStatus,
        deliveryDate,
        offers,
        payment,
        shippingAddress,
        orderDate,
        coupons,
        totalAmount,
        orderStatus,
        paymentMethod
      } = req.body;
      
      const {userId}=req.user;

      console.log("Inside addOrder2");
      console.log("Body : ",req.body);
  
      const newOrder = new Order({
        orderedItems,
        paymentStatus: paymentStatus || 'Pending',
        deliveryDate,
        offers,
        payment,
        shippingAddress,
        orderDate,
        coupons:coupons||'',
        totalAmount,
        paymentMethod,
        userId,
        orderStatus: orderStatus || 'Pending',
      });
  
      const savedOrder = await newOrder.save();
      console.log("orderedItems : ",orderedItems);
      for (const orderedItem of orderedItems) {
        const { product, quantity } = orderedItem;
          console.log("product, quantity",product,quantity);
        const productVariant = await ProductVariant.findOne({_id: product });
  
        if (productVariant && productVariant.stock >= quantity) {
          productVariant.stock -= quantity;
  
          await productVariant.save();
        } else {
          return res.status(400).json({ message: `Not enough stock for product with ID ${product}` });
        }
      }
  
      res.status(201).json({ message: 'Order added successfully', order: savedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

const showOrder=async(req,res)=>{
  try {
    const {orderId}=req.params;
    const order=await Order.findById(orderId);
    res.status(200).json({message:"Order found",order});
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error"});
  }
}
// const changeOrderStatus = async (req, res) => {
//   try {
//     const { orderId, orderStatus } = req.body;


//     if (!Order.schema.path('orderStatus').enumValues.includes(orderStatus)) {
//       return res.status(400).json({ error: 'Invalid orderStatus value' });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { $set: { orderStatus } },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    if (!Order.schema.path('orderStatus').enumValues.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid orderStatus value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { orderStatus } },
      { new: true }
    ).populate('userId payment');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the orderStatus is "Cancelled" or "Returned" and paymentMethod is "RazorPay"
    if (
      (orderStatus === 'Cancelled' || orderStatus === 'Returned') &&
      updatedOrder.paymentMethod === 'RazorPay'
    ) {
      // Find or create a wallet for the user
      let wallet = await Wallet.findOne({ user: updatedOrder.userId });

      if (!wallet) {
        // Create a new wallet if it doesn't exist
        wallet = new Wallet({ user: updatedOrder.userId });
      }

      // Add the refunded amount to the wallet balance
      wallet.balance += updatedOrder.totalAmount;

      // Create a transaction record for the refund
      const refundTransaction = new Transaction({
        type: 'Refund',
        amount: updatedOrder.totalAmount,
        orderId: updatedOrder._id,
      });

      // Push the refund transaction to the wallet's transactions array
      wallet.transactions.push(refundTransaction);

      // Save the updated or new wallet
      await wallet.save();
      await refundTransaction.save();
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports={
    showOrders,
    addOrder,
    showOrder,
    changeOrderStatus
}
