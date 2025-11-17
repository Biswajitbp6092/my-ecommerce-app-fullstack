import CategoryModel from "../models/category.model.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
});

//image Upload
let imagesArr = [];
export async function uploadImages(request, response) {
  try {
    imagesArr = [];

    const image = request.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${request.files[i].filename}`);
        }
      );
    }

    return response.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Create category
export async function createCategory(request, response) {
  try {
    let category = new CategoryModel({
      name: request.body.name,
      images: imagesArr,
      parentCatName: request.body.parentCatName,
      parentId: request.body.parentId,
    });

    if (!category) {
      return response.status(500).json({
        message: "Category Not Created",
        error: true,
        success: false,
      });
    }

    category = await category.save();
    imagesArr = [];
    return response.status(200).json({
      message: "Category Created",
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get All category
export async function getCategories(request, response) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return response.status(200).json({
      error: false,
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get category count
export async function getCategoriesCount(request, response) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });

    if (!categoryCount) {
      response.status(500).json({
        success: false,
        error: true,
      });
    } else {
      response.send({
        categoryCount: categoryCount,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//get subcategory count
export async function getSubCategoriesCount(request, response) {
  try {
    const categories = await CategoryModel.find();

    if (!categories) {
      response.status(500).json({ success: false, error: true });
    } else {
      const subCatArr = [];
      for (let cat of categories) {
        if (cat.parentId !== undefined) {
          subCatArr.push(cat);
        }
      }
      response.send({
        SubCategoryCount: subCatArr.length,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get singel category
export async function getCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);

    if (!category) {
      return response.status(500).json({
        message: "The Category with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

///
export async function removeImageFromCloudinary(request, response) {
  const imgUrl = request.query.img;

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  if (imageName) {
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error, res)
      }
    );

    if (res) {
      return response.status(200).json({
        error: false,
        success: true,
        message: "image deleted succesfully",
      });
    }
  }
}

export async function deleteCategory(request, response) {
  try {
    const category = await CategoryModel.findById(request.params.id);
    const images = category.images;

    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (!imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          // console.log(error, result)
        });
      }
    }

    const subCategory = await CategoryModel.find({
      parentId: request.params.id,
    });
    for (let i = 0; i < subCategory.length; i++) {
      const thirdsubCategory = await CategoryModel.find({
        parentId: subCategory[i]._id,
      });
      for (let i = 0; i < thirdsubCategory.length; i++) {
        const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(
          thirdsubCategory[i]._id
        );
      }
      const deleteSubCat = await CategoryModel.findByIdAndDelete(
        subCategory[i]._id
      );
    }
    const deletedCat = await CategoryModel.findByIdAndDelete(request.params.id);

    if (!deletedCat) {
      response.status(404).json({
        message: "category not found!",
        error: true,
        success: false,
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Category Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Category not found",
      error: true,
      success: false,
    });
  }
}

//Update category



export async function updatedCategory(request, response) {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
        parentCatName: request.body.parentCatName,
        parentId: request.body.parentId,
      },
      {
        new: true,
      }
    );
    if (!category) {
      return response.status(500).json({
        message: "Category can not be Updated!",
        error: true,
        success: false,
      });
    }
    (imagesArr = []),
      response.status(200).json({
        error: false,
        success: true,
        category: category,
      });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
