import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Provide Token",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    req.user = { id: decode.id };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "You are not logged in",
      error: true,
      success: false,
    });
  }
};

export default auth;
