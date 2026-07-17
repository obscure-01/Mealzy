import pool from "../config/db.js";

export async function getAvailableMenu(canteen_id) {
    const sql = "SELECT * FROM items WHERE is_available = true AND canteen_id = $1";
    const result = await pool.query(sql, [canteen_id]);
    return result.rows;
}

export async function getCompleteMenu(canteen_id) {
    const sql = "SELECT * FROM items WHERE canteen_id = $1";
    const result = await pool.query(sql, [canteen_id]);
    return result.rows;
}

export async function updateMenu(canteen_id, positions, values) {
    const sql = `
        UPDATE items AS i
        SET
            is_available = v.is_available,
            updated_at = CURRENT_TIMESTAMP
        FROM (
            VALUES
                ${positions.join(", ")}
        ) AS v(item_id, is_available)
        WHERE i.item_id = v.item_id AND i.canteen_id = $${positions.length + 1};`;

    const result = await pool.query(sql, [...values, canteen_id]);

    return result;
}