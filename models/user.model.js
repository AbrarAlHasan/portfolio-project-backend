import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please Provide Your UserName"],
    unique: [true, "Username Already Exists"],
    min: [3, "Minimum 3 Character Required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please Provide a Unique Email"],
    unique: [true, "Email Already Registered"],
  },
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
    min: [3, "Min 3 Characters.."],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
