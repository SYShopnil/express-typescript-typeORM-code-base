import * as dotenv from "dotenv";
import express, { Application } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { pagination } from "typeorm-pagination";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import userModule from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";
// import { UserController } from "./modules/user/user.controller";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app: Application = express();

const corsOption = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
// const userController = new UserController();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));
app.use(pagination);
app.use(cookieParser());
app.use(cors(corsOption));

app.use("/user", userModule);
app.use("/auth", authModule);

app.get("/", (_, res) => {
  // console.log(`Hello!!!`)
  res.json({
    message: "Hello I am from root",
    status: 202,
  });
});

createConnection()
  .then(async () => {
    console.log(`server is connected to the database!!!`);
    app.listen(PORT, () => {
      console.log(`server is connected to ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
