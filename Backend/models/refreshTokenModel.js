import pool from "../config/db.js";

export async function storeToken(token_id, token_hash, user_id, expires_at) {
    const sql = "INSERT INTO refresh_tokens (token_id, token_hash, user_id, expires_at) VALUES ($1,$2,$3, CURRENT_TIMESTAMP + ($4 * INTERVAL '1 day'))"
    const result = await pool.query(sql, [token_id, token_hash, user_id, expires_at]);
    return result;
} 

export async function findUser(token_id) {
    const sql = "SELECT * FROM refresh_tokens WHERE token_id = $1";
    const result = await pool.query(sql, [token_id]);    
    return result.rows;
}

export async function deleteToken(token_id) {
    const sql = "DELETE FROM refresh_tokens WHERE token_id = $1";
    const result = await pool.query(sql, [token_id]);
    return result;
}