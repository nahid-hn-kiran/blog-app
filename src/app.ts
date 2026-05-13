import express, { type Application } from "express";
import cors from "cors";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);

app.use(express.json());

// Routes
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/posts", postRouter);

export default app;
