export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}