import MyListModel from "../models/myList.model.js";

export const addToMyListController = async (request, response) => {
  try {
    const userId = request.user.id;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
    } = request.body;

    const item = await MyListModel.findOne({
      productId: productId,
      userId: userId,
    });

    if (item) {
      return response.status(400).json({
        message: "Item already in My List",
        error: true,
        success: false,
      });
    }

    const myList = new MyListModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
      userId,
    });

    const save = await myList.save();

    return response.status(201).json({
      success: true,
      error: false,
      message: "Item added to My List successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteToMyListController = async (request, response) => {
  try {
    const mylistitem = await MyListModel.findById(request.params.id);

    if (!mylistitem) {
      return response.status(404).json({
        message: "The item with the given ID was not found.",
        error: false,
        success: true,
      });
    }

    const deletedItem = await MyListModel.findByIdAndDelete(request.params.id);

    if (!deletedItem) {
      return response.status(400).json({
        message: "The item is not deleted.",
        error: false,
        success: true,
      });
    }
    return response.status(200).json({
      message: "the item remove form My List",
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

export const getMyListController = async (request, response) => {
  try {
    const userId = request.user.id;
    const myListItems = await MyListModel.find({ userId: userId });

    return response.status(200).json({
      message: "My List items fetched successfully",
      error: false,
      success: true,
      data: myListItems,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
