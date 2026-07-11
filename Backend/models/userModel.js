import pool from "../config/db.js";

export async function createUser(name, email, password_hash, phone_number, role) {
    const sql = "INSERT INTO users (name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5)";
    const result = await pool.query(sql, [name, email, password_hash, phone_number, role]);
    return result; 
}

export async function findUserPhoneNumber(phone_number) {
    const sql = "SELECT * FROM users WHERE phone_number = $1";
    const result = await pool.query(sql, [phone_number]);
    console.log(result.rows);
    
    return result.rows;
}