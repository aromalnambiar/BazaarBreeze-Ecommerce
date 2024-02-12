const Order=require('../../models/Order.js');

const viewOrders=async(req,res)=>{
    try {
        const orders=await Order.find();
        console.log("Orders : ",orders);
        res.status(200).json({message:"successfull",orders});
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
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
    viewOrders,
    changeOrderStatus
}