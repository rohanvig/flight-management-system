import { UserModel, IUser } from "../model/user.model.js";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async create(userData: Omit<IUser, "_id" | "createdAt">): Promise<IUser> {
    return await UserModel.create(userData);
  }
}