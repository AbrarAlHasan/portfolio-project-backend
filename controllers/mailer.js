import nodemailer from "nodemailer";

let testAccount = await nodemailer.createTestAccount();

const nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);

export const mailGenerator = (req, res, next) => {
  const { email, firstName, lastName } = req.body;

  var emailBody = {
    body: {
      name: firstName + " " + lastName,
      intro: `Your OTP is ${req.app.locals.OTP}`,
      outro: `Please Use the OTP`,
    },
  };
  let message = {
    from: "abraralhasan123@gmail.com",
    to: email,
    subject: "OTP",
    text: req.app.locals.OTP,
    html: `<b>THIS IS YOUR ONE TIME PASS ${req.app.locals.OTP}</b>`,
  };

  transporter
    .sendMail(message)
    .then(() => {
      next();
    })
    .catch((err) => res.status(500).json("Mail Error" + err.message));
};
