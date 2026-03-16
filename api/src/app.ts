import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverErrorHandler from "./middlewares/errorHandler.js";
import createTaskTable from "./data/createTaskTable.js";
import tasksRoute from "./routes/tasksRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  void createTaskTable();
}

app.get("/api", (req, res) => {
  res.send("Api is running.");
});

app.use("/api/tasks", tasksRoute);

app.use(serverErrorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
