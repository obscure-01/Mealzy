import pool from "../config/db.js";

export async function createItem(canteen_id, item_name, description, price, image_url, image_id, category, is_vegetarian) {
    const sql = "INSERT INTO items (canteen_id, item_name, description, price, image_url, image_id, category, is_vegetarian) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";
    const result = await pool.query(sql, [canteen_id, item_name, description, price, image_url, image_id, category, is_vegetarian]);
    return result;
}

export async function getItem(item_id) {
    const sql = "SELECT * FROM items WHERE item_id = $1";
    const result = await pool.query(sql, [item_id]);
    return result.rows;
}

export async function updateItem(item_id, canteen_id, fields, values) {
    const sql = `UPDATE items SET ${fields.join(", ")}, updated_at = current_timestamp WHERE item_id = $${fields.length + 1} AND canteen_id = $${fields.length + 2}`;
    const result = await pool.query(sql, [...values, item_id, canteen_id]);
    return result;
}

export async function deleteItem(item_id, canteen_id) {
    const sql = "DELETE FROM items WHERE item_id = $1 AND canteen_id = $2";
    const result = await pool.query(sql, [item_id, canteen_id]);
    return result;
}

export async function changeItemAvailability(item_id, canteen_id, is_available) {
    const sql = "UPDATE items SET is_available = $1, updated_at = current_timestamp WHERE item_id = $2 AND canteen_id = $3";
    const result = await pool.query(sql, [is_available, item_id, canteen_id]);
    return result; 
}

export async function getMultipleItems(positions, values) {
    const sql = `SELECT * FROM items WHERE item_id IN (${positions.join(", ")});`;
    const result = await pool.query(sql, values);
    return result.rows;
}