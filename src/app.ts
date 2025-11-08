import express from "express";
import morgan from "morgan";
import routerAdmin from "./routes/auth/admin.routes"

const app = express();


app.use(morgan("dev"));
app.use(express.json());


app.use(routerAdmin);

export default app;