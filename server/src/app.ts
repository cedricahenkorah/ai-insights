import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { stream } from "./config/logger";
import api from "./routes/api";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("combined", { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("ai-insights is live");
});

app.use("/api", api);

export default app;
