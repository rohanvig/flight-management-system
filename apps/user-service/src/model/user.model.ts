import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id:number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<IUser>("User", userSchema);