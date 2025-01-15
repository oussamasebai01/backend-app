import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/cnx.js";
import roleRoute from "./Routes/productRoute.js";
import roleRoutes from "./Routes/userRoute.js";
import path from "path";
import * as url from "url";

const app = express();

dotenv.config();

connectDB();

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use("/", roleRoute());
app.use("/", roleRoutes());

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
console.log("__dirname", __dirname);
app.use("/images", express.static(path.join(__dirname, "public/uploads")));
app.listen(process.env.PORT, () => {
  console.log("info", `Server started on port ${process.env.PORT}`);
});
