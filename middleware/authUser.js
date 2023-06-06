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

export function clearLocalVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

export const verifyJWT = (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies) return req.status(401).json({ message: "JWT Token Error" });

    const token = cookies.jwt;
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      console.log(decoded);
      console.log(err);
      if (err) return res.status(403).json({ message: err });
      next();
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
