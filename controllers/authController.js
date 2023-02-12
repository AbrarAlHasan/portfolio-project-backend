import UserModal from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/**Register User */
export async function register(req, res) {
  try {
    const { userName, password, email, firstName, lastName, phoneNumber } =
      req.body;
    console.log("Entered the Function", req.body);

    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const user = new UserModal({
          userName,
          password: hashedPassword,
          email,
          firstName,
          lastName,
          phoneNumber,
        });
        user
          .save()
          .then(() => res.status(200).json("Registration Successful"))
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err.message));
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
export async function verifyUser(req, res, next) {
  try {
    const { userName } = req.method == "GET" ? req.query : req.body;

    //check User
    let exist = await UserModal.findOne({ userName });
    if (!exist) return res.status(404).json("Can't Find User");
    next();
  } catch (err) {
    return res.status(500).json(err.message);
  }
}

/**Login User */
export async function login(req, res) {
  const { userName, password } = req.body;
  try {
    UserModal.findOne({ userName })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(404).json("Password Doesn't Match!");

            //Create JWT Token
            const token = jwt.sign(
              {
                userId: user._id,
                userName,
              },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res
              .status(200)
              .json({ message: "Login Successful", userName, token });
          })
          .catch((err) => res.status(404).json("Password Doesn't Match"));
      })
      .catch((err) => res.status(404).json("User Not Found"));
  } catch (err) {
    return res.status(500).json(err.message);
  }
}
/**Authenticate User */
export async function authenticate(req, res) {
  res.json("authenticate route");
}
export async function getUser(req, res) {
  const { userId } = req.params;
  try {
    if (!userId) return res.status(500).json("Invalid UserId");

    UserModal.findById(userId)
      .then((user) => {
        if (!user)
          return res.status(400).json("UserId Not Found. Please Register");
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).json(rest);
      })
      .catch((err) => res.status(500).json(err.message));
  } catch (err) {
    res.status(500).json(err.message);
  }
}
export async function generateOTP(req, res, next) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  next();
}

export async function verifyOTP(req, res) {
  const { otp } = req.body;
  if (parseInt(req.app.locals.OTP) === parseInt(otp)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(200).json("OTP Verification Successful");
  }
  return res.status(500).json("invalid OTP");
}
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; //To enable the Forget password Route only once
    return res.status(200).json("Access Granted !");
  }
}
export async function resetPassword(req, res) {
  try {
    const { userName, password } = req.body;
    if (req.app.locals.resetSession)
      return res.status(400).json("Session Expired");

    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        UserModal.updateOne(
          { userName: userName },
          { password: hashedPassword },
          (err, data) => {
            if (err) return res.status(500).json(err.message);
            req.app.locals.resetSession = false;
            return res.status(200).json("Password Changed Successfully");
          }
        );
      })
      .catch((err) => res.status.json("Password Hash Error"));
  } catch (err) {
    return res.status(500).json(err.message);
  }
}
export const getUsers = (req, res) => {
  UserModal.find().then((users) => res.status(200).json(users));
};
