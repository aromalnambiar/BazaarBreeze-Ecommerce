const Order=require('../../models/Order');

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
        coupons,
        totalAmount,
        paymentMethod,
        userId,
        orderStatus: orderStatus || 'Pending',
      });
  
      const savedOrder = await newOrder.save();
  
      res.status(201).json({ message: 'Order added successfully', order: savedOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
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
