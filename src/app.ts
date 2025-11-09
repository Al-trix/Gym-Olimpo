import express from "express";
import morgan from "morgan";
import routerAdmin from "./routes/auth/admin.routes"
import cookieParser from 'cookie-parser'

const app = express();


app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());


app.use(routerAdmin);

export default app;