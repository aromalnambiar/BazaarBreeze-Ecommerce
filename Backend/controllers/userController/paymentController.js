const Razorpay = require("razorpay");
const crypto = require("crypto");

const placeOrder = async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount*100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
			payment_capture: 1
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
			   console.log(error);
			   return res.status(500).json({ message: "Something Went Wrong!" });
			}
		 
			// Check the payment response and set paymentStatus accordingly
			// const paymentStatus = req.body.success ? "Completed" : "Failed";
		 
			// Return the order details with the appropriate paymentStatus
			res.status(200).json({ data: { ...order } });
		 });
		 
		
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};

const verifyOrder= async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
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




const paymentCapture=async (req, res) => {
	const secret_key = '1234567890'

const data = crypto.createHmac('sha256', secret_key)

   data.update(JSON.stringify(req.body))

   const digest = data.digest('hex')

if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       res.json({

           status: 'ok'

       })

} else {

       res.status(400).send('Invalid signature');

   }

}

const refund=async(req,res)=>{

		try {
	 
			//Verify the payment Id first, then access the Razorpay API.
	 
			const options = {
	 
				payment_id: req.body.paymentId,
	 
				amount: req.body.amount,
	 
			};
	 
	 const razorpayResponse = await Razorpay.refund(options);	 
			//We can send the response and store information in a database
	 
			res.send('Successfully refunded')
	 
		} catch (error) {
	 
			console.log(error);
	 
			res.status(400).send('unable to issue a refund');
	 
		}
	 
}



module.exports = {
	placeOrder,
	verifyOrder,
	paymentCapture
};