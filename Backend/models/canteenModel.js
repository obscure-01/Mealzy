import pool from "../config/db.js";

export async function createCanteen(canteen_name, canteen_location, opening_time, closing_time) {
    const sql = "INSERT INTO canteens (canteen_name, canteen_location, opening_time, closing_time) VALUES ($1,$2,$3, $4)";
    const result = await pool.query(sql, [canteen_name, canteen_location, opening_time, closing_time]);
    return result;
}

export async function updateCanteen(canteen_id, fields, values) {
    const sql = `UPDATE canteens SET ${fields.join(", ")} WHERE canteen_id = ${fields.lenght + 1}`;
    const result = await pool.query(sql, [...values, canteen_id]);
    return result;
}

export async function getCanteen(canteen_id) {
    const sql = `SELECT * FROM canteens WHERE canteen_id = $1`;
    const result = await pool.query(sql, [canteen_id]);
    return result;
}

export async function deleteCanteen(canteen_id) {
    const sql = "DELETE FROM canteens WHERE canteen_id = $1";
    const result = await pool.query(sql, [canteen_id]);
    return result;
}

export async function openCanteen(canteen_id, is_open) {
    const sql = "UPDATE canteens SET is_open = $1 WHERE canteen_id = $2";
    const result = await pool.query(sql, [canteen_id, is_open]);
    return result;
}