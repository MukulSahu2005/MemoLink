import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "password is required"]
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function(this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(
    {
      _id: this._id,
      username: this.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: (process.env.JWT_EXPIRY || "1d") as any
    }
  );
};

export const userModel = mongoose.model<IUser>("User", userSchema);
