import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

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

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
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

export async function getTotalOrdersCountController(request, response) {
  try {
    const ordersCount = await OrderModel.countDocuments();
    return response.status(200).json({
      error: false,
      success: true,
      count: ordersCount,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAllOrdersController(request, response) {
  try {
    const { page, limit } = request.query;
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate(["delivery_address", "userId"])
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await OrderModel.countDocuments();
    return response.status(200).json({
      error: false,
      success: true,
      data: orders,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function totalSalesController(request, response) {
  try {
    const currentYear = new Date().getFullYear();
    const orderlist = await OrderModel.find();

    let totalSales = 0;
    let monthlySales = [
      {
        name: "January",
        totalSales: 0,
      },
      {
        name: "February",
        totalSales: 0,
      },
      {
        name: "March",
        totalSales: 0,
      },
      {
        name: "April",
        totalSales: 0,
      },
      {
        name: "May",
        totalSales: 0,
      },
      {
        name: "June",
        totalSales: 0,
      },
      {
        name: "July",
        totalSales: 0,
      },
      {
        name: "August",
        totalSales: 0,
      },
      {
        name: "September",
        totalSales: 0,
      },
      {
        name: "October",
        totalSales: 0,
      },
      {
        name: "November",
        totalSales: 0,
      },
      {
        name: "December",
        totalSales: 0,
      },
    ];

    for (let i = 0; i < orderlist.length; i++) {
      totalSales += Number(orderlist[i].totalAmt);

      const createdAt = new Date(orderlist[i].createdAt);
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth(); // 0–11

      if (currentYear == year) {
        if (month === 1) {
          monthlySales[0] = {
            name: "January",
            totalSales: (monthlySales[0].totalSales =
              parseInt(monthlySales[0].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 2) {
          monthlySales[1] = {
            name: "February",
            totalSales: (monthlySales[1].totalSales =
              parseInt(monthlySales[1].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 3) {
          monthlySales[2] = {
            name: "March",
            totalSales: (monthlySales[2].totalSales =
              parseInt(monthlySales[2].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 4) {
          monthlySales[3] = {
            name: "April",
            totalSales: (monthlySales[3].totalSales =
              parseInt(monthlySales[3].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 5) {
          monthlySales[4] = {
            name: "May",
            totalSales: (monthlySales[4].totalSales =
              parseInt(monthlySales[4].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 6) {
          monthlySales[5] = {
            name: "June",
            totalSales: (monthlySales[5].totalSales =
              parseInt(monthlySales[5].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 7) {
          monthlySales[6] = {
            name: "July",
            totalSales: (monthlySales[6].totalSales =
              parseInt(monthlySales[6].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 8) {
          monthlySales[7] = {
            name: "August",
            totalSales: (monthlySales[7].totalSales =
              parseInt(monthlySales[7].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 9) {
          monthlySales[8] = {
            name: "September",
            totalSales: (monthlySales[8].totalSales =
              parseInt(monthlySales[8].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 10) {
          monthlySales[9] = {
            name: "October",
            totalSales: (monthlySales[9].totalSales =
              parseInt(monthlySales[9].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 11) {
          monthlySales[10] = {
            name: "November",
            totalSales: (monthlySales[10].totalSales =
              parseInt(monthlySales[10].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
        if (month === 12) {
          monthlySales[11] = {
            name: "December",
            totalSales: (monthlySales[11].totalSales =
              parseInt(monthlySales[11].totalSales) +
              parseInt(orderlist[i].totalAmt)),
          };
        }
      }
    }
    return response.status(200).json({
      totalSales: totalSales,
      monthlySales: monthlySales,
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

export async function totalUsersController(request, response) {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    let monthlyUsers = [
      {
        name: "January",
        TotalUsers: 0,
      },
      {
        name: "February",
        TotalUsers: 0,
      },
      {
        name: "March",
        TotalUsers: 0,
      },
      {
        name: "April",
        TotalUsers: 0,
      },
      {
        name: "May",
        TotalUsers: 0,
      },
      {
        name: "June",
        TotalUsers: 0,
      },
      {
        name: "July",
        TotalUsers: 0,
      },
      {
        name: "August",
        TotalUsers: 0,
      },
      {
        name: "September",
        TotalUsers: 0,
      },
      {
        name: "October",
        TotalUsers: 0,
      },
      {
        name: "November",
        TotalUsers: 0,
      },
      {
        name: "December",
        TotalUsers: 0,
      },
    ];
    for (let i = 0; i < users.length; i++) {
      if (users[i]?._id?.month === 1) {
        monthlyUsers[0] = {
          name: "January",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 2) {
        monthlyUsers[1] = {
          name: "February",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 3) {
        monthlyUsers[2] = {
          name: "March",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 4) {
        monthlyUsers[3] = {
          name: "April",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 5) {
        monthlyUsers[4] = {
          name: "May",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 6) {
        monthlyUsers[5] = {
          name: "June",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 7) {
        monthlyUsers[6] = {
          name: "July",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 8) {
        monthlyUsers[7] = {
          name: "August",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 9) {
        monthlyUsers[8] = {
          name: "September",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 10) {
        monthlyUsers[9] = {
          name: "October",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 11) {
        monthlyUsers[10] = {
          name: "November",
          TotalUsers: users[i]?.count,
        };
      }
      if (users[i]?._id?.month === 12) {
        monthlyUsers[11] = {
          name: "December",
          TotalUsers: users[i]?.count,
        };
      }
    }
    return response.status(200).json({
      TotalUsers: monthlyUsers,
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
