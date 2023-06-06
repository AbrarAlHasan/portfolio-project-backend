import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const nodeConfig = {
  service: "gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASS,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

export const mailGenerator = (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  console.log(process.env.OTP_EMAIL, process.env.OTP_EMAIL_PASS);

  let message = {
    from: "abraralhasanprogrammer@gmail.com",
    to: email,
    subject: "OTP",
    text: `THe One-Time-Password is ${req.app.locals.OTP}`,
  };

  transporter
    .sendMail(message)
    .then((res) => {
      console.log("OTP has sent to the Mail ", res);
      next();
    })
    .catch((err) => res.status(500).json("Mail Error" + err.message));
};
