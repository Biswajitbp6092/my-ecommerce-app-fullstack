import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import VerifificationEmail from "../utils/verifyEmailTemplates.js";

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
      html: VerifificationEmail(name, verifyCode),
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
