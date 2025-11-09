import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerificationEmail from "../utils/verifyEmailTemplates.js";
import generateAccessToken from "../utils/generatedAccessToken.js";
import generateRefreshToken from "../utils/generatedRefreshToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { error } from "console";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
});

export async function registerUserController(request, response) {
  try {
    let user;
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email, name and password",
        error: true,
        success: false,
      });
    }
    user = await UserModel.findOne({ email: email });

    if (user) {
      return response.json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new UserModel({
      email: email,
      password: hashedPassword,
      name: name,
      otp: verifyCode,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();

    // send verification email
    await sendEmailFun({
      sendTo: email,
      subject: "Verify email from Ecommarce app",
      text: "",
      html: VerificationEmail(name, verifyCode),
    });

    //Create JWT token for verification purpose
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      {}
    );

    return response.status(200).json({
      success: true,
      error: false,
      message: "User registered successfully, please verify your email",
      token: token,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return response
        .status(400)
        .json({ error: true, success: false, message: "User not found" });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpiry > Date.now();

    if (isCodeValid && isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return response.status(200).json({
        error: false,
        success: true,
        message: "Email verified successfully",
      });
    } else if (!isCodeValid) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid verification code",
      });
    } else {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Verification OTP expired",
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

export async function loginUserController(request, response) {
  try {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "user not Registered",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "contact to admin",
        error: true,
        success: false,
      });
    }
    if (user.verify_email !== true) {
      return response.status(400).json({
        message: "Your email is not verify yet Please verify your email frist",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return response.status(400).json({
        message: "check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
      // accessToken: accessToken,
    });

    const cookieOptions = {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    return response.json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userid = request.user.id;

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookieOptions);
    response.clearCookie("refreshToken", cookieOptions);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refreshToken: "",
    });

    return response.json({
      message: "Logout successful",
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

//image Upload
let imagesArr = [];
export async function userAvatarController(request, response) {
  try {
    imagesArr = [];

    const userid = request.user.id;
    const images = request.files;

    const user = await UserModel.findOne({ _id: userid });

    if (!user) {
      return response.status(500).json({
        message: "User Not found",
        error: true,
        success: false,
      });
    }

    ///frist remove image from cloudinary

    const imgUrl = user.avatar;

    const urlArr = imgUrl.split("/");
    const avatar_image = urlArr[urlArr.length - 1];

    const imageName = avatar_image.split(".")[0];

    if (imageName) {
      const res = await cloudinary.uploader.destroy(
        imageName,
        (error, result) => {
          // console.log(error, res)
        }
      );
    }

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
          fs.unlinkSync(`uploads/${images[i].filename}`);
        }
      );
    }
    user.avatar = imagesArr[0];
    await user.save();
    return response.status(200).json({
      _id: userid,
      avatar: imagesArr[0],
      success: true,
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

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

//update user details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.params.id;
    const { name, email, mobile, password } = request.body;

    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return response.status(400).send("The User cannot be updated!");
    }

    let verifyCode = "";

    if (email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: name,
        mobile: mobile,
        email: email,
        verify_email: email !== userExist.email ? false : true,
        password: hashPassword,
        otp: verifyCode !== "" ? verifyCode : null,
        otpExpiry: verifyCode !== "" ? Date.now() + 600000 : null,
      },
      { new: true }
    );
    if (email !== userExist.email) {
      await sendEmailFun({
        sendTo: email,
        subject: "Verify email from Ecommarce App",
        text: "",
        html: VerificationEmail(name, verifyCode),
      });
    }
    return response.json({
      message: "User Update Successfully",
      error: false,
      success: true,
      user: {
        _id: updateUser?._id,
        name: updateUser?.name,
        email: updateUser?.email,
        mobile: updateUser?.mobile,
        avatar: updateUser?.avatar,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//forgot password
export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = verifyCode;
      user.otpExpiry = Date.now() + 600000;

      await user.save();

      await sendEmailFun({
        sendTo: email,
        subject: "Verify email from Ecommarce app",
        text: "",
        html: VerificationEmail(user.name, verifyCode),
      });

      return response.json({
        message: "Chek your email",
        error: false,
        success: true,
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

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }
    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp",
        error: true,
        success: false,
      });
    }
    if (otp !== user.otp) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    const currentTime = Date.now();

    if (user.otpExpiry < currentTime) {
      return response.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    user.otp = "";
    user.otpExpiry = "";
    await user.save();

    return response.status(200).json({
      message: "Verify OTP Successfully ",
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

//reset password

export async function resetPassword(request, response) {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        error: true,
        success: false,
        message:
          "Provide required fields email, New Password, Confrim Passwoed",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email is not Available",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: "Your Old password is Wrong",
        error: true,
        success: false,
      });

    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "new password and confrim password must be same.",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(confirmPassword, salt);

    user.password = hashPassword;
    await user.save();

    return response.json({
      message: "Password update successfully",
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

//refresh token controler
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookie.refreshToken ||
      request?.headers?.authorization?.split("")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return response.status(401).json({
        message: "Token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?._id;
    const newAccessToken = await generateAccessToken(userId);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    response.cookie("accessToken", newAccessToken, cookieOptions);

    return response.json({
      message: "New Access token generate",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get login user details
export async function userDetails(request, response) {
  try {
    const userId = request.user.id;
    console.log(userId);

    const user = await UserModel.findById(userId).select(
      "-password -refreshToken"
    );

    return response.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false,
    });
  }
}
