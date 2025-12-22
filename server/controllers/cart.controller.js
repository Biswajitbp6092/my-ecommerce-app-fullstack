import CartProductModel from "../models/cart.model.js";
// import CartProductModel from "../models/cartproduct.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.body.userId; //middleware

    const {
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      quantity,
      subTotal,
      productId,
      countInStock,
      discount,
      size,
      weight,
      ram,
      brand,
    } = request.body;

    if (!productId) {
      return response.status(402).json({
        message: "Provide ProductID",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Item already in cart",
      });
    }

    const cartItem = new CartProductModel({
      productTitle: productTitle,
      image: image,
      rating: rating,
      price: price,
      oldPrice: oldPrice,
      quantity: quantity,
      subTotal: subTotal,
      productId: productId,
      countInStock: countInStock,
      userId: userId,
      brand: brand,
      discount: discount,
      size: size,
      weight: weight,
      ram: ram,
    });

    const save = await cartItem.save();

    return response.status(200).json({
      data: save,
      message: "Item Add succesfuly",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getCartItemController = async (request, response) => {
  try {
    const userId = request.user.id; //middleware

    const cartItem = await CartProductModel.find({
      userId: userId,
    });

    return response.status(200).json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.user.id;

    const { _id, qty, subTotal, size, weight, ram } = request.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: "Provide _id, qty",
      });
    }
    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
        subTotal: subTotal,
        size: size,
        weight: weight,
        ram: ram,
      },
      { new: true }
    );

    return response.status(200).json({
      message: "Update Cart Item",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        message: "Provide id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: id,
      userId: userId,
    });

    if (!deleteCartItem) {
      return response.status(400).json({
        message: "The product in the cart not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Item remove",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const emptyCartController = async (request, response) => {
  try {
    const userId = request.params.id;

    await CartProductModel.deleteMany({ userId: userId });

    return response.status(200).json({
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
