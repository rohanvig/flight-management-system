import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "flight_management_system";
const DB_USER = process.env.DB_USER || "myuser";
// const DB_PASSWORD = process.env.DB_PASSWORD || "mypassword";
const DB_HOST = process.env.DB_HOST || "localhost";

const sequelize = new Sequelize(DB_NAME, DB_USER, {
  host: DB_HOST,
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => sequelize.sync())
      .then(() => console.log("PostgreSQL connected..."));
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
};

export default sequelize;
