import pool from "../config/db.js";

export async function createOrder(client, order_values) {
    const sql = `INSERT INTO orders (user_id, canteen_id, total_price) VALUES ($1, $2, $3) RETURNING order_id;`;
    const result = await client.query(sql, order_values);
    return result.rows[0].order_id;
}

export async function createOrderItems(client, order_item_positions, order_item_values) {
    const sql = `INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES ${positions.join(", ")}`
    const result = await client.query(sql, order_item_values);
    return result;
}


export async function getOrder() {
    
}

export async function cancleOrder() {
    
}

export async function acceptOrder() {
    
}

export async function cancelOrder() {
    
}

// accept