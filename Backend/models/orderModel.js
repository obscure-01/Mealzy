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

// who needs to see what
export async function getUserOrder(user_id, order_id) {
    const sql = "SELECT * from orders WHERE user_id = $1 AND order_id = $2;";
    const result = await pool.query(sql, [user_id, order_id]);
    return result;
}


export async function getCanteenOrder(canteen_id, order_id) {
    const sql = "SELECT * from orders WHERE canteen_id = $1 AND order_id = $2;";
    const result = await pool.query(sql, [canteen_id, order_id]);
    return result.rows;
}

// order history reflects some current info update schema to fix 
export async function getOrderItems(order_id) {
    const sql = "SELECT i.item_name, i.image_url, i.category, i.is_vegetarian, o.quantity, o.price_at_order FROM order_items o JOIN items i on o.item_id = i.item_id WHERE o.order_id = $1";
    const result = await pool.query(sql, [order_id]);
    return result.rows;
}

export async function getMultipleOrdersItems(positions, values) {
    const sql = `SELECT o.order_id, i.item_name, i.image_url, i.category, i.is_vegetarian, o.quantity, o.price_at_order FROM order_items o JOIN items i on o.item_id = i.item_id WHERE o.order_id = (${positions.join(', ')})`;
    const result = await pool.query(sql, [values]);
    return result.rows;
}



export async function getAllUserOrders(user_id) {
    const sql = "SELECT * FROM order WHERE user_id = $1";
    const result = await pool.query(sql, [user_id]);
    return result;
}

// join to get user info with the details
export async function getCanteenOrderHistory(canteen_id) {
    const sql = "SELECT u.name, u.phone_number, u.email, u.profile_picture, o.order_id, o.status, o.accepted_by, o.order_time, o.completed_at, o.cancelled_at, o.estimated_ready_time FROM orders o JOIN users u ON o.user_id = u.user_id WHERE canteen_id = $1 ORDER BY o.status, o.order_time;"
    const result = await pool.query(sql, [canteen_id]);
    return result;
}

// check whether the status is pending or not
export async function cancleOrderUser(user_id, order_id) {
    const sql = `UPDATE orders SET status = "cancelled" WHERE order_id = $1 AND user_id = $2 AND status = "pending"`;
    const result = await pool.query(sql, [order_id, user_id]);
    return result;
}

export async function cancelOrderCanteen(canteen_id, order_id) {
    const sql = `UPDATE orders SET status = "cancelled" WHERE order_id = $1 AND canteen_id = $2`;
    const result = await pool.query(sql, [order_id, canteen_id]);
    return result;
}


export async function acceptOrder(user_id, canteen_id, order_id) {
    const sql = `UPDATE orders SET status = "accepted", accepted_by = $1 WHERE canteen_id = $2 AND order_id = $3`;
    const result = await pool.query(sql, [user_id, canteen_id, order_id]);
    return result;
}


export async function orderPreparing(canteen_id, order_id) {
    const sql = `UPDATE orders SET status = "preparing" WHERE order_id = $1 AND canteen_id = $2`;
    const result = await pool.query(sql, [order_id, canteen_id]);
    return result;
}

export async function orderCompleted(canteen_id, order_id) {
    const sql = `UPDATE orders SET status = "completed" WHERE order_id = $1 AND canteen_id = $2`;
    const result = await pool.query(sql, [order_id, canteen_id]);
    return result;
}