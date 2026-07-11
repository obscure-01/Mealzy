import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/userRoutes.js";
import refreshTokenRoutes from "./routes/refreshTokenRoutes.js"
import CookieParser from "cookie-parser";


const server_port = process.env.server_port

const server = express();

server.use(express.json());

server.use(CookieParser());

server.use("/api", userRoutes);

server.use("/api", refreshTokenRoutes);

server.listen(server_port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Server is running on port' + server_port);
});

