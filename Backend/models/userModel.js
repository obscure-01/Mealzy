import pool from "../config/db.js";

export async function createUser(name, email, password_hash, phone_number, role) {
    const sql = "INSERT INTO users (name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5)";
    const result = await pool.query(sql, [name, email, password_hash, phone_number, role]);
    return result; 
}

export async function findUserByPhoneNumber(phone_number) {
    const sql = "SELECT * FROM users WHERE phone_number = $1";
    const result = await pool.query(sql, [phone_number]);
    return result.rows;
}

export async function getUser(user_id) {
    const sql = "SELECT (name, phone_number, email,profile_picture) FROM users WHERE user_id = $1";
    const result = await pool.query(sql, [user_id]);
    return result;
}

