import ProductModel from "../models/product.model.js";

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

//create products

export async function createProduct(request, response) {
  try {
    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: imagesArr,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      category: request.body.category,
      catId: request.body.catId,
      subCatId: request.body.subCatId,
      subCat: request.body.subCat,
      thirdSubCat: request.body.thirdSubCat,
      thirdSubCatId: request.body.thirdSubCatId,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      productRam: request.body.productRam,
      size: request.body.size,
      productWeight: request.body.productWeight,
    });
    product = await product.save();

    if (!product) {
      return response.status(500).json({
        error: true,
        success: false,
        message: "Product not Created",
      });
    }

    imagesArr = [];
    response.status(200).json({
      message: "Product Created Successfully",
      error: false,
      success: true,
      product: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product
export async function getAllProduct(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by catId
export async function getAllProductByCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by category name
export async function getAllProductByCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ catName: request.query.catName })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by sub Category Id
export async function getAllProductBySubCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCatId: request.params.id })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by sub Category name
export async function getAllProductBySubCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({ subCat: request.query.subCat })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by ThirdLavel Category Id
export async function getAllProductByThirdLavelCatId(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdSubCatId: request.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by ThirdLavel Category name
export async function getAllProductByThirdLavelCatName(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdSubCat: request.query.thirdSubCat,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by price
export async function getAllProductByPrice(request, response) {
  try {
    let productList = [];
    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: request.query.catId,
      }).populate("category");
      productList = productListArr;
    }
    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: request.query.subCatId,
      }).populate("category");
      productList = productListArr;
    }
    if (
      request.query.thirdSubCatId !== "" &&
      request.query.thirdSubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdSubCatId: request.query.thirdSubCatId,
      }).populate("category");
      productList = productListArr;
    }
    const filteredProducts = productList.filter((product) => {
      if (
        request.query.minPrice &&
        product.price < parseInt(request.query.minPrice)
      ) {
        return false;
      }
      if (
        request.query.maxPrice &&
        product.price > parseInt(request.query.maxPrice)
      ) {
        return false;
      }
      return true;
    });

    return response.status(200).json({
      error: false,
      success: true,
      products: filteredProducts,
      totalPage: 0,
      page: 0,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all product by rating
export async function getAllProductByRating(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Page not Found",
        success: false,
        error: true,
      });
    }

    let products = [];

    if (request.query.catId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        catId: request.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }
    if (request.query.subCatId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        subCatId: request.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (request.query.thirdSubCatId !== undefined) {
      products = await ProductModel.find({
        rating: request.query.rating,
        thirdSubCatId: request.query.thirdSubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPage: totalPage,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// get all products count
export async function getProductsCount(request, response) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      return response.status(500).json({
        message: "products not found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      productsCount: productsCount,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get all featured products
export async function getAllFeaturedProduct(request, response) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      products: products,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Delete Product
export async function deleteProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );

    if (!product) {
      return response.status(404).json({
        message: "Product Not Found",
        error: true,
        success: false,
      });
    }

    const images = product.images;

    let img = "";
    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result)
        });
      }
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(
      request.params.id
    );

    if (!deletedProduct) {
      return response.status(404).json({
        message: "Products not Deleted",
        error: true,
        success: false,
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Product Deleted!",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete multiple product
export async function deleteMultipleProduct(request, response) {
  const { ids } = request.body;
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  for (let i = 0; i < ids?.length; i++) {
    const product = await ProductModel.findById(ids[i]);

    const images = product.images;
    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result)
        });
      }
    }
  }

  try {
    await ProductModel.deleteMany({ _id: { $in: ids } });
    return response.status(200).json({
      message: 'Product Delete Succesfully',
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

//get single products
export async function getProduct(request, response) {
  try {
    const product = await ProductModel.findById(request.params.id).populate(
      "category"
    );

    if (!product) {
      return response.status(404).json({
        message: "The Products is Not Found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      product: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//delete images
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
      response.status(200).send(res);
    }
  }
}

//update Product
export async function updateProduct(request, response) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      {
        name: request.body.name,
        description: request.body.description,
        brand: request.body.brand,
        price: request.body.price,
        oldPrice: request.body.oldPrice,
        catName: request.body.catName,
        catId: request.body.catId,
        subCatId: request.body.subCatId,
        subCat: request.body.subCat,
        thirdSubCat: request.body.thirdSubCat,
        thirdSubCatId: request.body.thirdSubCatId,
        category: request.body.category,
        countInStock: request.body.countInStock,
        rating: request.body.rating,
        isFeatured: request.body.isFeatured,
        discount: request.body.discount,
        productRam: request.body.productRam,
        size: request.body.size,
        productWeight: request.body.productWeight,
        name: request.body.name,
      },
      {
        new: true,
      }
    );

    if (!product) {
      response.status(404).json({
        message: "the Product can not be updated!",
        status: false,
      });
    }
    imagesArr = [];

    return response.status(200).json({
      message: "The Product is Updated",
      error: false,
      success: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
