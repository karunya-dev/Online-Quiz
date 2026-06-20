import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || "online_quiz",
    user: process.env.POSTGRES_USER || "quiz_user",
    password: process.env.POSTGRES_PASSWORD || "quiz_password"
  },
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017",
  mongoDb: process.env.MONGO_DB || "online_quiz_content",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379"
};
