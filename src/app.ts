import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


export default app;