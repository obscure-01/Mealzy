import pool from "../config/db.js";
import * as orderModel from "../models/orderModel.js";

export async function createOrder(order_values, order_items) {
    
    const client = await pool.client();

    try {
        await client.query("BEGIN");

        const order_id = await orderModel.createOrder(client, order_values);

        let order_items_positions = [];
        let order_items_values = [];
        order_items.forEach(item => {
            order_items_positions.push(`($${order_items_values.length + 1}, $${order_items_values.length + 2}, $${order_items_values.length + 3}, $${order_items_values.length + 4})`);
            order_items_values.push(order_id, item.item_id, item.quantity, item.price);
        });

        await orderModel.createOrderItems(client, order_items_positions, order_items_values);

        await client.query("COMMIT");
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
}