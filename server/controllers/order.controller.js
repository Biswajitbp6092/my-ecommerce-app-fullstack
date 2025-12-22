import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

// paypal

export const createOrderController = async (request, response) => {
  try {
    let order = new OrderModel({
      userId: request.body.userId,
      products: request.body.products,
      paymentId: request.body.paymentId,
      payment_status: request.body.payment_status,
      delivery_address: request.body.delivery_address,
      totalAmt: request.body.totalAmt,
      date: request.body.date,
    });
    if (!order) {
      return response?.status(500).json({
        error: true,
        success: false,
      });
    }

    for (let i = 0; i < request.body.products.length; i++) {
      await ProductModel.findByIdAndUpdate(
        request.body.products[i].productId,
        {
          countInStock: parseInt(
            request.body.products[i].countInStock -
              request.body.products[i].quantity
          ),
        },
        { new: true }
      );
    }
    order = await order.save();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Order Placed Succesfull",
      order: order,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.user.id; // product id

    console.log(userId);

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createAt: -1 })
      .populate(["delivery_address", "userId"]);

    return response.status(200).json({
      message: "Order list",
      data: orderlist,
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
}

export async function updateOrderStatusController(request, response) {
  try {
    const { id, order_status } = request.body;

    const updateOrder = await OrderModel.updateOne(
      {
        _id: id,
      },
      {
        order_status: order_status,
      },
      { new: true }
    );
    return response.status(200).json({
      message: "Update Order Status",
      success: true,
      error: false,
      data: updateOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
