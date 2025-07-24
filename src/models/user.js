import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  county: { type: String, required: true },
  subcounty: { type: String, required: true },
  ward: { type: String, required: true },
  polling_centre: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "observer" },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String }
});

export default mongoose.model("User", userSchema);
