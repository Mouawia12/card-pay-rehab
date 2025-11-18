import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.js";
import { sendSuccess } from "./utils/response.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? ["*"];

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));

app.get("/", (_req, res) => sendSuccess(res, { message: "Card Pay API" }));
app.use("/api", routes);
app.use(errorHandler);

export default app;
