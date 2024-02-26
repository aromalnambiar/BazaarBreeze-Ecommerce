const Order=require('../../models/Order');
const ProductVariant=require('../../models/ProductVariant');
const Wallet=require("../../models/Wallet");
const Transaction=require("../../models/Transaction");

const showOrders = async (req, res) => {
  try {
    const { userId } = req.user;
    // console.log("user id ", userId);

    const orders = await Order.find({ userId }).populate({
      path: 'orderedItems.product',
      model: 'ProductVariant',
      select: 'images', // Select only the 'images' field from ProductVariant
    });

    if (!orders || orders.length === 0) {
      return res.status(400).json({ message: "No orders found" });
    }

    // Extract only necessary fields from product variant, and get the first image
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      orderedItems: order.orderedItems.map((item) => ({
        ...item.toObject(),
        product: {
          images: item.product.images.length > 0 ? [item.product.images[0]] : [], 
        },
      })),
    }));
    // console.log("formatted Orders : ",formattedOrders)
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
            orderStatus // Include orderStatus in the request body
        } = req.body;

        const { userId } = req.user;

        // console.log("Inside addOrder2");
        // console.log("Body : ", req.body);

        // Ensure coupons field is valid ObjectId or null
        const validatedCoupons = coupons ? mongoose.Types.ObjectId(coupons) : null;

        const newOrder = new Order({
            orderedItems: orderedItems.map(item => ({
                ...item,
                orderStatus: orderStatus || 'Pending', // Set default orderStatus if not provided
            })),
            paymentStatus: paymentStatus || 'Pending',
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

            if (!cancelStatus) { // Check if the item is not canceled before updating stock
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
    console.log("order : ",order);
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
    const { orderId, orderedItemId, orderStatus } = req.body;
    console.log("req body : ",req.body);
    // Find the order by orderId and orderedItemId
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

    // Extract the updated ordered item
    const updatedOrderedItem = updatedOrder.orderedItems.find(item => item._id.toString() === orderedItemId);

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
      wallet.balance += updatedOrderedItem.price * updatedOrderedItem.quantity;

      // Create a transaction record for the refund
      const refundTransaction = new Transaction({
        type: 'Refund',
        amount: updatedOrderedItem.price * updatedOrderedItem.quantity,
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
    changeOrderStatus,

}
