const Product=require('../../models/Products.js');
const ProductVariant=require('../../models/ProductVariant.js');
const Order=require('../../models/Order.js');
const Category=require('../../models/Category.js');

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

  const getBestSellingProducts = async (req, res) => {
    try {
      // Fetch all delivered orders
      const orders = await Order.find({ orderStatus: 'Delivered' });
      console.log('Delivered Orders:', orders);
  
      // Ensure that orders are available
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No delivered orders found' });
      }
  
      // Flatten orderedItems array from all orders
      const allOrderedItems = orders.flatMap(order => order.orderedItems);
      console.log('All Ordered Items:', allOrderedItems);
  
      // Ensure that orderedItems are available
      if (!allOrderedItems || allOrderedItems.length === 0) {
        return res.status(404).json({ error: 'No ordered items found in delivered orders' });
      }
  
      // Group and sum quantities for each product variant
      const productQuantities = allOrderedItems.reduce((acc, item) => {
        const productId = item.product.toString();
        acc[productId] = (acc[productId] || 0) + item.quantity;
        return acc;
      }, {});
  
      console.log('Product Quantities:', productQuantities);
  
      // Ensure that productQuantities is not empty
      if (Object.keys(productQuantities).length === 0) {
        return res.status(404).json({ error: 'No valid products found in ordered items' });
      }
  
      // Sort products by quantity in descending order
      const sortedProducts = Object.entries(productQuantities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
  
      console.log('Sorted Products:', sortedProducts);
  
      // Retrieve product variant details based on the sorted product variant IDs
      const bestSellingProductVariants = await Promise.all(
        sortedProducts.map(async ([productId, quantity]) => {
          const productVariant = await ProductVariant.findOne({_id: productId });
  
          // Ensure that the product variant details are available
          if (!productVariant) {
            return null;
          }
  
          return { productVariant, quantity };
        })
      );
  
      console.log('Best Selling Product Variants:', bestSellingProductVariants);
  
      // Filter out null values (product variants that could not be found)
      const validProductVariants = bestSellingProductVariants.filter(
        productVariant => productVariant !== null
      );
  
      res.json(validProductVariants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };  

  // const getBestSellingCategories = async (req, res) => {
  //   try {
  //     const orders = await Order.find({ orderStatus: 'Delivered' });
  
  //     // Ensure that orders are available
  //     if (!orders || orders.length === 0) {
  //       return res.status(404).json({ error: 'No delivered orders found' });
  //     }
  
  //     // Flatten orderedItems array from all orders
  //     const allOrderedItems = orders.flatMap((order) => order.orderedItems);
  
  //     if (!allOrderedItems || allOrderedItems.length === 0) {
  //       return res.status(404).json({ error: 'No ordered items found in delivered orders' });
  //     }
  
  //     const categoryQuantities =await allOrderedItems.reduce(async (acc, item) => {
  //       const productId = item.product.toString();
  
  //       // Ensure that the product with the given ID exists
  //       const productVariant = await ProductVariant.findById(productId);
  //       if (!productVariant) {
  //         console.log(`ProductVariant not found for ID: ${productId}`);
  //         return acc;
  //       }
  
  //       const product = await Product.findById(productVariant.productId);
  //       // console.log("PRODUCT : ",product);
  //       // Ensure that the product with the given productId exists
  //       if (!product) {
  //         console.log(`Product not found for ID: ${productVariant.productId}`);
  //         return acc;
  //       }
  
  //       const category = product.category;
  //       console.log("category : ",category);
  //       // Ensure that the product has a valid category
  //       if (!category) {
  //         console.log(`Product with ID ${product._id} does not have a valid category`);
  //         return acc;
  //       }
  
  //       acc[category] = (acc[category] || 0) + item.quantity;
  //       return acc;
  //     }, {});
  //     console.log("first")
  //     console.log("categoryQuantities : ",categoryQuantities );
      
  //     // Ensure that categoryQuantities is not empty
  //     if (Object.keys(categoryQuantities).length === 0) {
  //       return res
  //         .status(404)
  //         .json({ error: 'No valid products found with categories in ordered items' });
  //     }
  
  //     // Sort categories by quantity in descending order
  //     const sortedCategories = Object.entries(categoryQuantities)
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, 10);
  
  //     console.log('Category Quantities:', categoryQuantities);
  //     console.log('Sorted Categories:', sortedCategories);
  
  //     res.json(sortedCategories);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // };
  const getBestSellingCategories = async (req, res) => {
    try {
      const orders = await Order.find({ orderStatus: 'Delivered' });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No delivered orders found' });
      }
  
      const allOrderedItems = orders.flatMap((order) => order.orderedItems);
  
      if (!allOrderedItems || allOrderedItems.length === 0) {
        return res.status(404).json({ error: 'No ordered items found in delivered orders' });
      }
  
      const categoryQuantities = await calculateCategoryQuantities(allOrderedItems);
  
      if (Object.keys(categoryQuantities).length === 0) {
        return res.status(404).json({ error: 'No valid products found with categories in ordered items' });
      }
  
      const sortedCategories = await sortCategoriesByQuantity(categoryQuantities);
  
      res.json(sortedCategories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const calculateCategoryQuantities = async (orderedItems) => {
    return await orderedItems.reduce(async (accPromise, item) => {
      const acc = await accPromise;
  
      const productId = item.product.toString();
      const productVariant = await ProductVariant.findById(productId);
  
      if (!productVariant) {
        console.log(`ProductVariant not found for ID: ${productId}`);
        return acc;
      }
  
      const product = await Product.findById(productVariant.productId);
  
      if (!product) {
        console.log(`Product not found for ID: ${productVariant.productId}`);
        return acc;
      }
  
      const category = product.category;
  
      if (!category) {
        console.log(`Product with ID ${product._id} does not have a valid category`);
        return acc;
      }
  
      acc[category] = (acc[category] || 0) + item.quantity;
      return acc;
    }, Promise.resolve({}));
  };
  
  const getCategoryNameById = async (categoryId) => {
    const category = await Category.findById(categoryId);
    return category ? category.name : null;
  };
  
  const sortCategoriesByQuantity = async (categoryQuantities) => {
    const sortedCategories = Object.entries(categoryQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  
    const sortedCategoriesWithNames = await Promise.all(sortedCategories.map(async ([categoryId, quantity]) => {
      const categoryName = await getCategoryNameById(categoryId);
      return [categoryName, quantity];
    }));
  
    return sortedCategoriesWithNames;
  };
  const getMonthlySales = async (req, res) => {
    try {
        const { month } = req.query;

        // Validate 'month' parameter

        const monthlySales = await Order.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: '$orderDate' }, parseInt(month)] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 } // Count the number of orders
                }
            }
        ]);

        res.json({
            monthlySales: monthlySales[0]?.totalSales || 0,
            orderCount: monthlySales[0]?.orderCount || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMonthlySalesArray = async (req, res) => {
  try {
      const monthlySalesArray = await Order.aggregate([
          {
              $group: {
                  _id: { month: { $month: '$orderDate' }, orderStatus: '$orderStatus' },
                  count: { $sum: 1 }
              }
          },
          {
              $group: {
                  _id: '$_id.month',
                  salesCount: {
                      $sum: {
                          $cond: [
                              { $in: ['$_id.orderStatus', ['Pending', 'Processing', 'Shipped','Delivered','Cancelled','Returned']] },
                              '$count',
                              0
                          ]
                      }
                  },
                  deliveredCount: {
                      $sum: {
                          $cond: [
                              { $eq: ['$_id.orderStatus', 'Delivered'] },
                              '$count',
                              0
                          ]
                      }
                  },
                  cancelledCount: {
                      $sum: {
                          $cond: [
                              { $eq: ['$_id.orderStatus', 'Cancelled'] },
                              '$count',
                              0
                          ]
                      }
                  }
              }
          },
          {
              $project: {
                  _id: 0,
                  month: '$_id',
                  salesCount: 1,
                  deliveredCount: 1,
                  cancelledCount: 1
              }
          },
          {
              $sort: { month: 1 } // Sort the results by month
          }
      ]);

      res.json(monthlySalesArray);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


  // const getBestSellingBrands = async (req, res) => {
  //   try {
  //     const orders = await Order.find({ "orderStatus": "Delivered" });
  
  //     // Ensure that orders are available
  //     if (!orders || orders.length === 0) {
  //       return res.status(404).json({ error: 'No delivered orders found' });
  //     }
  
  //     // Flatten orderedItems array from all orders
  //     const allOrderedItems = orders.flatMap(order => order.orderedItems);
  
  //     // Ensure that orderedItems are available
  //     if (!allOrderedItems || allOrderedItems.length === 0) {
  //       return res.status(404).json({ error: 'No ordered items found in delivered orders' });
  //     }
  
  //     // Group and sum quantities for each brand
  //     const brandQuantities = allOrderedItems.reduce(async (acc, item) => {
  //       const productId = item.product.toString();
        
  //       // Ensure that the product with the given ID exists
  //       const product = await Product.findById(productId);
  //       if (!product) {
  //         return acc;
  //       }
  
  //       const brand = product.brand;
  //       acc[brand] = (acc[brand] || 0) + item.quantity;
  //       return acc;
  //     }, {});
  
  //     // Ensure that brandQuantities is not empty
  //     if (Object.keys(brandQuantities).length === 0) {
  //       return res.status(404).json({ error: 'No valid products found in ordered items' });
  //     }
  
  //     // Sort brands by quantity in descending order
  //     const sortedBrands = Object.entries(brandQuantities)
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, 10);
  
  //     res.json(sortedBrands);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // };
  const getBestSellingBrands = async (req, res) => {
    try {
      const orders = await Order.find({ orderStatus: 'Delivered' });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No delivered orders found' });
      }
  
      const allOrderedItems = orders.flatMap((order) => order.orderedItems);
  
      if (!allOrderedItems || allOrderedItems.length === 0) {
        return res.status(404).json({ error: 'No ordered items found in delivered orders' });
      }
  
      const brandQuantities = await calculateBrandQuantities(allOrderedItems);
  
      if (Object.keys(brandQuantities).length === 0) {
        return res.status(404).json({ error: 'No valid products found with brands in ordered items' });
      }
  
      const sortedBrands = await sortBrandsByQuantity(brandQuantities);
  
      res.json(sortedBrands);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const calculateBrandQuantities = async (orderedItems) => {
    return await orderedItems.reduce(async (accPromise, item) => {
      const acc = await accPromise;
  
      const productId = item.product.toString();
      const productVariant = await ProductVariant.findById(productId);
  
      if (!productVariant) {
        console.log(`ProductVariant not found for ID: ${productId}`);
        return acc;
      }
  
      const product = await Product.findById(productVariant.productId);
  
      if (!product) {
        console.log(`Product not found for ID: ${productVariant.productId}`);
        return acc;
      }
  
      const brand = product.brand;
  
      if (!brand) {
        console.log(`Product with ID ${product._id} does not have a valid brand`);
        return acc;
      }
  
      acc[brand] = (acc[brand] || 0) + item.quantity;
      return acc;
    }, Promise.resolve({}));
  };
  
  const getBrandNameById = async (brandId) => {
    // You might need to modify this based on your brand model structure
    // Assuming the brand ID is the brand name for simplicity
    return brandId;
  };
  
  const sortBrandsByQuantity = async (brandQuantities) => {
    const sortedBrands = Object.entries(brandQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  
    const sortedBrandsWithNames = await Promise.all(sortedBrands.map(async ([brandId, quantity]) => {
      const brandName = await getBrandNameById(brandId);
      return [brandName, quantity];
    }));
  
    return sortedBrandsWithNames;
  };

module.exports={
    viewOrders,
    changeOrderStatus,
    getBestSellingProducts,
    getBestSellingCategories,
    getBestSellingBrands,
    getMonthlySales,
    getMonthlySalesArray
}