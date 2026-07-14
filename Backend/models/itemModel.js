import pool from "../config/db.js";

export async function createItem(canteen_id, item_name, decription, price, image_url, category, is_vegetarian) {
    const sql = "INSERT INTO items (canteen_id, item_name, decription, price, image_url, category, is_vegetarian) VALUES ($1,$2,$3,$4,$5,$6,$7)";
    const result = await pool.query(sql, [canteen_id, item_name, decription, price, image_url, category, is_vegetarian]);
    return result;
}

export async function getItem(item_id) {}

export async function updateItem(item_id, fields, values) {}

export async function deleteItem(item_id) {}

export async function changeItemAvailability(item_id, is_available) {}

