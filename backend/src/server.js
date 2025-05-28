import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import transactionRouter from "./routes/transaction.route.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

if (process.env.NODE_ENV == "production") {
  job.start();
}
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRouter);

async function initDb() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error(error);
    console.log("Database initialization failed");
    process.exit(1);
  }
}

initDb().then(() => {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
