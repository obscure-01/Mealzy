import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import itemRoutes from "./routes/itemRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import canteenRoutes from "./routes/canteenRoutes.js";
import CookieParser from "cookie-parser";


const server_port = process.env.server_port;

const server = express();

server.use(express.json());

server.use(CookieParser());

server.use("/api", authRoutes);

server.use("/api", userRoutes);

server.use("/api", itemRoutes);

server.use("/api", menuRoutes);

server.use("/api", canteenRoutes);

server.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({message: err.message || "Internal Server Error"});
});

server.listen(server_port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server is running on port' + server_port);
});

