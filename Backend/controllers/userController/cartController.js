const Cart = require("../../models/Cart");
const ProductVariant = require("../../models/ProductVariant");
const Product = require("../../models/Products");
const Offer = require("../../models/Offer");

const addToCart = async (req, res) => {
  try {
    const { productVariantId, quantity } = req.body;
    const { userId } = req.user;
    console.log("pv : ", productVariantId);
    console.log("quantity : ", quantity);
    console.log("userId : ", userId);

    const productVariant = await ProductVariant.findById(productVariantId);

    if (!productVariant) {
      return res.status(404).json({ message: "Product variant not found" });
    }
    console.log("quantity : ", quantity);
    console.log("productVariant Stock : ", productVariant.stock);
    const uCart = await Cart.findOne({
      user: userId,
      "product.productVariantId": productVariantId,
    });
    console.log("user cart : ", uCart);
    if (uCart?.product?.length > 0) {
      if (uCart.product[0].quantity + 1 > productVariant.stock) {
        return res
          .status(400)
          .json({ message: "Insufficient stock available" });
      }
    }

    const userCart = await Cart.findOne({ user: userId });

    const maxQuantityPerPerson = 5; // Set your maximum quantity per person
    // console.log("userCart : ",userCart);

    if (userCart) {
      const existingProductIndex = userCart.product.findIndex((item) =>
        item.productVariantId.equals(productVariantId)
      );
      console.log("existing : ", existingProductIndex);
      if (existingProductIndex !== -1) {
        const totalQuantity =
          userCart.product[existingProductIndex].quantity + quantity;

        if (totalQuantity > maxQuantityPerPerson) {
          return res.status(400).json({
            message: `Maximum ${maxQuantityPerPerson} quantity allowed per person`,
          });
        }

        userCart.product[existingProductIndex].quantity += quantity || 1;
      } else {
        userCart.product.push({
          productVariantId,
          quantity: quantity || 1,
        });
      }
      await userCart.save();
      res
        .status(200)
        .json({ message: "Successfully added to cart", cart: userCart });
    } else {
      const newUserCart = new Cart({ user: userId });
      console.log("newUserCart : ", newUserCart);
      newUserCart.product.push({
        productVariantId,
        quantity: quantity || 1,
      });
      await newUserCart.save();
      res.status(200).json({
        message: "Successfully added to cart",
        cart: userCart || newUserCart,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteFromCart = async (req, res) => {
  try {
    const { productVariantId } = req.query;
    const { userId } = req.user;
    console.log("userId , productVariantId ", req.query);
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const existingProductIndex = userCart.product.findIndex((item) =>
      item.productVariantId.equals(productVariantId)
    );
    if (existingProductIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product variant not found in the cart" });
    }
    userCart.product.splice(existingProductIndex, 1);
    await userCart.save();
    res
      .status(200)
      .json({ message: "Successfully deleted from cart", cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const showCart = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     // Fetch the user's cart with populated product details
//     const cart = await Cart.findOne({ user: userId }).populate({
//       path: 'product.productVariantId',
//       model: 'ProductVariant',
//       select: 'variantName salePrice images _id productId',
//     });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Check if the cart is empty
//     if (!cart.product || cart.product.length === 0) {
//       return res.status(200).json({ message: "Cart is empty", cart });
//     }

//     // Fetch and populate offer details for each product in the cart
//     const populatedCart = await Promise.all(cart.product.map(async (cartItem) => {
//       const product = await ProductVariant.findById(cartItem.productVariantId);

//       // Fetch the highest discount offer for the current product
//       const productOffers = await Offer.find({
//         $or: [
//           { productId: product.productId },
//           { categoryId: product.category },
//         ],
//         validUntil: { $gte: new Date() },
//         isActive: true,
//       });

//       let highestDiscountOffer = null;
//       let highestDiscountValue = 0;

//       productOffers.forEach((offer) => {
//         if (offer.discountType === 'Percentage') {
//           const discountValue = (product.regularPrice * offer.discountValue) / 100;
//           if (discountValue > highestDiscountValue) {
//             highestDiscountOffer = offer;
//             highestDiscountValue = discountValue;
//           }
//         } else if (offer.discountType === 'FixedAmount') {
//           if (offer.discountValue > highestDiscountValue) {
//             highestDiscountOffer = offer;
//             highestDiscountValue = offer.discountValue;
//           }
//         }
//       });

//       // Add the offer details to the cart item
//       return {
//         product: {
//           ...product.toObject(),
//           offer: highestDiscountOffer,
//         },
//         quantity: cartItem.quantity,
//       };
//     }));

//     res.status(200).json({ message: "Success", cart: populatedCart });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server issue" });
//   }
// };

// const showCart = async (req, res) => {
//   try {
//     const { userId } = req.user;

//     // Fetch the user's cart with populated product details
//     const cart = await Cart.findOne({ user: userId }).populate({
//       path: 'product.productVariantId',
//       model: 'ProductVariant',
//       select: 'variantName salePrice images _id productId',
//     });

//     console.log("cart 1: ");

//     if (!cart) {
//       console.log("cart 2: ");
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     console.log("cart11 : ",cart);
//     if (!cart.product || cart.product.length === 0) {
//       console.log("cart 3: ");
//       return res.status(200).json({ message: "Cart is empty", cart });
//     }

//     // Fetch and populate offer details for each product in the cart
//     const populatedCart = await Promise.all(cart.product.map(async (cartItem) => {
//       const product = await ProductVariant.findById(cartItem.productVariantId);

//       // Fetch the highest discount offer for the current product
//       const productOffers = await Offer.find({
//         $or: [
//           { productId: product.productId },
//           { categoryId: product.category },
//         ],
//         validUntil: { $gte: new Date() },
//         isActive: true,
//       });

//       let highestDiscountOffer = null;
//       let highestDiscountValue = 0;

//       productOffers.forEach((offer) => {
//         if (offer.discountType === 'Percentage') {
//           const discountValue = (product.regularPrice * offer.discountValue) / 100;
//           if (discountValue > highestDiscountValue) {
//             highestDiscountOffer = offer;
//             highestDiscountValue = discountValue;
//           }
//         } else if (offer.discountType === 'FixedAmount') {
//           if (offer.discountValue > highestDiscountValue) {
//             highestDiscountOffer = offer;
//             highestDiscountValue = offer.discountValue;
//           }
//         }
//       });

//       // Add the offer details to the cart item
//       return {
//         productVariantId: {
//           ...product.toObject(),
//           offer: highestDiscountOffer,
//         },
//         quantity: cartItem.quantity,
//       };
//     }));

//     console.log("populatedCart : ",{product:populatedCart});

//     res.status(200).json({ message: "Success", cart: {product:populatedCart} });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server issue" });
//   }
// };
const showCart = async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch the user's cart with populated product details
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "product.productVariantId",
      model: "ProductVariant",
      select:
        "variantName salePrice images _id productId category regularPrice",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!cart.product || cart.product.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart });
    }

    // Fetch and populate offer details for each product in the cart
    const populatedCart = await Promise.all(
      cart.product.map(async (cartItem) => {
        console.log("cartiItem ; ", cartItem);
        const product = cartItem.productVariantId;

        // Fetch the highest discount offer for the current product
        const productOffers = await Offer.find({
          $or: [
            { productId: product.productId },
            { categoryId: product.category },
          ],
          validUntil: { $gte: new Date() },
          isActive: true,
        });

        let highestDiscountOffer = null;
        let highestDiscountValue = 0;

        productOffers.forEach((offer) => {
          if (offer.discountType === "FixedAmount") {
            if (offer.discountValue > highestDiscountValue) {
              highestDiscountOffer = offer;
              highestDiscountValue = offer.discountValue;
            }
          } else if (offer.discountType === "Percentage") {
            const discountValue =
              (product.regularPrice * offer.discountValue) / 100;
            if (discountValue > highestDiscountValue) {
              highestDiscountOffer = offer;
              highestDiscountValue = discountValue;
            }
          }
        });

        // Add the offer details to the cart item
        return {
          productVariantId: {
            ...product.toObject(),
            offer: highestDiscountOffer,
          },
          quantity: cartItem.quantity,
        };
      })
    );

    res
      .status(200)
      .json({ message: "Success", cart: { product: populatedCart } });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server issue" });
  }
};

const clearCart = async (req, res) => {
  try {
    console.log("clear cart : ");
    const { userId } = req.user;
    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "Cart cleared after order" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  deleteFromCart,
  showCart,
  clearCart,
};
