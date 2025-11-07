import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    var token = req.cookies.accessToken || req.headers?.authorization?.split(" ")
    [1];

    if(!token){
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Provide token ",
      });
    }

    const decode =  jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

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
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
