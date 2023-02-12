import jwt from "jsonwebtoken";

export default function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //retrive the userDetails for logged in User
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(500).json("Authorization failed");
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
