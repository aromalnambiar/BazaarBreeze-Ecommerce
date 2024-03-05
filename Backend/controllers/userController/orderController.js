const Order=require('../../models/Order');
const ProductVariant=require('../../models/ProductVariant');
const Wallet=require("../../models/Wallet");
const Transaction=require("../../models/Transaction");

const showOrders = async (req, res) => {
  try {
    const { userId } = req.user;

    const orders = await Order.find({ userId }).populate({
      path: 'orderedItems.product',
      model: 'ProductVariant',
      select: 'images', 
    });

    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: "No orders found" });
    }

    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      orderedItems: order.orderedItems.map((item) => ({
        ...item.toObject(),
        product: {
          images: item.product.images.length > 0 ? [item.product.images[0]] : [], 
        },
      })),
    }));
    res.status(200).json({ message: "Success", orders: formattedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addOrder  = async (req, res) => {
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
            paymentMethod,
        } = req.body;

        const { userId } = req.user;


        const validatedCoupons = coupons ? mongoose.Types.ObjectId(coupons) : null;

        const newOrder = new Order({
            orderedItems: orderedItems.map(item => ({
                ...item,
                orderStatus:  'Pending',
                paymentStatus: paymentStatus || 'Pending',
            })),
            deliveryDate,
            offers,
            payment,
            shippingAddress,
            orderDate,
            coupons: validatedCoupons,
            totalAmount,
            paymentMethod,
            userId,
        });

        const savedOrder = await newOrder.save();
        // console.log("orderedItems : ", orderedItems);
        for (const orderedItem of orderedItems) {
            const { product, quantity, cancelStatus } = orderedItem;
            console.log("product, quantity", product, quantity);

            if (!cancelStatus) { 
                const productVariant = await ProductVariant.findOne({ _id: product });

                if (productVariant && productVariant.stock >= quantity) {
                    productVariant.stock -= quantity;

                    await productVariant.save();
                } else {
                    return res.status(400).json({ message: `Not enough stock for product with ID ${product}` });
                }
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

const changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderedItemId, orderStatus } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        'orderedItems._id': orderedItemId,
      },
      { $set: { 'orderedItems.$.orderStatus': orderStatus } },
      { new: true }
    ).populate('userId payment');

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order or ordered item not found' });
    }

    const updatedOrderedItem = updatedOrder.orderedItems.find(item => item._id.toString() === orderedItemId);

    if (
      (orderStatus === 'Cancelled' || orderStatus === 'Returned') &&
      updatedOrder.paymentMethod === 'RazorPay'
    ) {
      let wallet = await Wallet.findOne({ user: updatedOrder.userId });

      if (!wallet) {
        wallet = new Wallet({ user: updatedOrder.userId });
      }

      wallet.balance += updatedOrderedItem.price * updatedOrderedItem.quantity;

      const refundTransaction = new Transaction({
        type: 'Refund',
        amount: updatedOrderedItem.price * updatedOrderedItem.quantity,
        orderId: updatedOrder._id,
      });

      wallet.transactions.push(refundTransaction);

      await wallet.save();
      await refundTransaction.save();
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const changePaymentStatus=async(req,res)=>{
      try {
        const { orderId, paymentStatus } = req.body;
    
        if (!orderId || !paymentStatus) {
          return res.status(400).json({ message: 'Invalid input parameters' });
        }
    
        const order = await Order.findById(orderId);
    
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        order.orderedItems.forEach((item) => {
          item.paymentStatus = paymentStatus;
        });
    
        await order.save();
    
        res.status(200).json({ message: 'Payment status updated successfully' });
      } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
};


module.exports={
    showOrders,
    addOrder,
    showOrder,
    changeOrderStatus,
    changePaymentStatus
}
