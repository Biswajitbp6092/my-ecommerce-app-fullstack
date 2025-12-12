import BlogModel from "../models/blog.model.js";
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

    const images = request.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < images?.length; i++) {
      const img = await cloudinary.uploader.upload(
        images[i].path,
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

//Create blog
export async function addBlog(request, response) {
  try {
    let blog = new BlogModel({
      title: request.body.title,
      images: imagesArr,
      description: request.body.description,
    });

    if (!blog) {
      return response.status(500).json({
        message: "Blog Not Created",
        error: true,
        success: false,
      });
    }

    blog = await blog.save();
    imagesArr = [];
    return response.status(200).json({
      message: "Blog Created",
      error: false,
      success: true,
      blog: blog,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get All Blog
export async function getBlogs(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);
    const totalPosts = await BlogModel.countDocuments();
    const totalPage = Math.ceil(totalPosts / perPage);

    if (page > totalPage) {
      return response.status(404).json({
        message: "Blog not Found",
        success: false,
        error: true,
      });
    }
    const blogs = await BlogModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!blogs) {
      response.status(500).json({
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      error: false,
      success: true,
      blogs: blogs,
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

//get singel Blog
export async function getBlog(request, response) {
  try {
    const blog = await BlogModel.findById(request.params.id);

    if (!blog) {
      return response.status(500).json({
        message: "The blog with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      blog: blog,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//delete Blog
export async function deleteBlog(request, response) {
  try {
    const blog = await BlogModel.findById(request.params.id);
    const images = blog.images;

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

    const deletedBlog = await BlogModel.findByIdAndDelete(request.params.id);

    if (!deletedBlog) {
      response.status(404).json({
        message: "Blog not found!",
        error: true,
        success: false,
      });
    }
    response.status(200).json({
      success: true,
      error: false,
      message: "Blog Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//update blog
export async function updatedBlog(request, response) {
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      request.params.id,
      {
        title: request.body.title,
        description: request.body.description,
        images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
      },
      {
        new: true,
      }
    );
    if (!blog) {
      return response.status(500).json({
        message: "blog can not be Updated!",
        error: true,
        success: false,
      });
    }
    (imagesArr = []),
      response.status(200).json({
        error: false,
        success: true,
        blog: blog,
        message: "Blog Updated Sucessfully",
      });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
