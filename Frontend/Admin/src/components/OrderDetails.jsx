import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <div className="container mx-auto mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h2 className="text-3xl font-bold mb-6">Order Details</h2>

        {/* Display User Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">User Details</h3>
          <p>Email: {order.userId.email}</p>
          <p>Username: {order.userId.username}</p>
        </div>

        {/* Display Shipping Address */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
          <p>Street: {order.shippingAddress.street}</p>
          <p>State: {order.shippingAddress.state}</p>
          <p>Pincode: {order.shippingAddress.pincode}</p>
          {/* Add more shipping address details as needed */}
        </div>

        {/* Display Order and Delivery Dates */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Dates</h3>
          <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
        </div>

        {/* Display Ordered Items */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Ordered Items</h3>
          {order.orderedItems.map((item) => (
            <div key={item.product._id} className="mb-6 border-b pb-4">
              <p className="mb-2">Variant Name: {item.product.variantName}</p>
              <p className="mb-2 flex">
                Product Image: <img src={`${BASE_URL}/uploads/${item.product.images[0]}`} className="w-32 h-32 object-contain" alt="" />
              </p>
              <p className="mb-2">Current Price: {item.product.salePrice}</p>
              <p className="mb-2">Ordered Price: {item.price}</p>
              <p className="mb-2">Quantity: {item.quantity}</p>
              <p>Total Price: {item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
