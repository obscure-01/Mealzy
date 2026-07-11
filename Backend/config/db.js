// check how .env is used after deployment
import dotenv from "dotenv";
import {Pool} from "pg";
import { fileURLToPath } from "url";
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

dotenv.config({
    path:path.join(__dirName, "../.env")
});

const pool = new Pool({
    host: process.env.host,
    port: Number(process.env.database_port),
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

export default pool;
