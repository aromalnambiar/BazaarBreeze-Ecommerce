const Order=require('../../models/Order');
const ProductVariant=require('../../models/ProductVariant');
const Razorpay = require("razorpay");
const crypto = require("crypto");

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

const razorpay=async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

const verify=async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
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
