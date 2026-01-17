import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize({
  database: process.env.POSTGRES_DB || "flight_db",
  username: process.env.POSTGRES_USER || "booking_user",
  password: process.env.POSTGRES_PASSWORD || "strongpassword",
  host: process.env.DB_HOST || "localhost",
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
