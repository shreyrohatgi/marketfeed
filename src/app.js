import express, { json } from "express";
import * as dotenv from "dotenv";
import { githubRoute } from "./routes/githubRoutes";

const app = express();
dotenv.config();
app.use(json());

// Routes
app.use("/api", githubRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
