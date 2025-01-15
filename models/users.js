import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lasttName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  OTP: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});
user.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const Users = mongoose.model("User", user);
export default Users;
