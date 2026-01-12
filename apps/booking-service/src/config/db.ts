import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("PostgreSQL connected...");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
};

export default sequelize;
