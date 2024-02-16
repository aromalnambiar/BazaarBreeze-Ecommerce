const Order=require('../../models/Order.js');

const viewOrders = async (req, res) => {
  try {
      const orders = await Order.find().populate('userId');
      
      const simplifiedOrders = orders.map(order => ({
          orderId: order._id,
          userId: order.userId._id,
          username: order.userId.username,
          orderDate: order.orderDate,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          orderStatus: order.orderStatus,
          totalAmount: order.totalAmount,
      }));

      res.status(200).json({ message: "successful", orders: simplifiedOrders });
  } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error");
  }
};



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
    viewOrders,
    changeOrderStatus
}