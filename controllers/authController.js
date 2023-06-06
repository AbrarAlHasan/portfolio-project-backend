import UserModal from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const nodeConfig = {
  service: "gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASS,
  },
};

/**Register User */
export async function register(req, res) {
  try {
    const { password, email, firstName, lastName, phoneNumber } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModal({
      // userName,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      phoneNumber,
    });
    const userSaved = await user.save();
    return res.status(200).json({
      _id: userSaved?._id,
      email: userSaved?.email,
      firstName: userSaved?.firstName,
      lastName: userSaved?.lastName,
      phoneNumber: userSaved?.phoneNumber,
    });
  } catch (err) {
    return res.status(500).json("Error" + err.message);
  }
}

/**Update User */
export async function updateUser(req, res) {
  const { userId } = req.user;

  try {
    if (userId) {
      const body = req.body;
      UserModal.updateOne({ _id: userId }, body)
        .then(() => res.status(200).json("User Details Updated"))
        .catch((err) => res.status.json(err.message));
    }
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

/**Verify User */
export async function CheckIsVerified(req, res, next) {
  try {
    const { email } = req.body;
    //check User
    let exist = await UserModal.findOne({ email: email });
    if (!exist) return res.status(404).json("Can't Find User");
    if (!exist.isVerified) {
      req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      let transporter = nodemailer.createTransport(nodeConfig);

      let message = {
        from: "abraralhasanprogrammer@gmail.com",
        to: exist.email,
        subject: "OTP",
        text: `The One-Time-Password is ${req.app.locals.OTP}`,
      };

      await transporter.sendMail(message);

      return res.status(401).json("Please Verify the OTP sent to the Mail");
    }
    next();
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

/**Login User */
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and Password is Required" });
    const user = await UserModal.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not Found" });
    const checkPassword = await bcrypt.compare(password, user?.password);
    if (!checkPassword)
      return res.status(401).json({ message: "Password is Incorrect" });
    const accessToken = jwt.sign(
      { userId: user?._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { userId: user?._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1m" }
    );
    const updatedUser = await UserModal.findOneAndUpdate(
      { _id: user?._id },
      { refreshToken },
      { new: true }
    );
    console.log(updatedUser);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ userId: user?._id, accessToken });
  } catch (err) {
    return res.status(401).json(err.message);
  }
}

// export async function getUser(req, res) {
//   const { userId } = req.params;
//   try {
//     if (!userId) return res.status(500).json("Invalid UserId");

//     UserModal.findById(userId)
//       .then((user) => {
//         if (!user)
//           return res.status(400).json("UserId Not Found. Please Register");
//         const { password, ...rest } = Object.assign({}, user.toJSON());

//         return res.status(200).json(rest);
//       })
//       .catch((err) => res.status(500).json(err.message));
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// }
export async function generateOTP(req, res, next) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  next();
}

export async function verifyOTP(req, res) {
  const { otp, userId } = req.body;
  console.log(otp, userId);
  console.log(
    parseInt(req.app.locals.OTP) === parseInt(otp),
    req.app.locals.OTP,
    parseInt(otp)
  );
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    try {
      const user = await UserModal.findOneAndUpdate(
        { _id: userId },
        { isVerified: true },
        { new: true }
      );
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res
        .status(200)
        .json({ message: "OTP Verification Successful", user });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
  return res.status(500).json("invalid OTP");
}

export const getUsers = (req, res) => {
  UserModal.find().then((users) => res.status(200).json(users));
};

export const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  const refreshToken = cookies.jwt;
  let userId = undefined;
  const value = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: err });

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1d",
        }
      );
      console.log(decoded.userId, accessToken);
      return { userId, accessToken };
    }
  );
  return res.status(200).json(value);
};

export const logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).send("Logout successful");
};
