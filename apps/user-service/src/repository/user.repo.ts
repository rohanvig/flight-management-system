import { User } from "../model/user.model.js";
import type {
  UserAttributes,
  UserCreationAttributes,
} from "../model/user.model.js";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  async create(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }
}
