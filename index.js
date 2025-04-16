import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("database connected");
}
main().catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", userRouter);
app.use("/todos", todoRouter);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
