import pool from "../config/db.js";
import * as userModel from "../models/userModel.js"
import * as orderModel from "../models/orderModel.js";

export async function createOrder(order_values, order_items) {
    
    const client = await pool.connect();

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

export async function getUserOrderDetails(user_id, order_id) {

    const order_data = await orderModel.getUserOrder(user_id, order_id);

    if (order_data.rowCount === 0) {
        return {notFound:true};
    }
    
    // return rows of data as a list
    const order_item_data = await orderModel.getOrderItems(order_id);

    const details = {
            info : order_data.rows[0],
            items : order_item_data
    }

    return details;
}


// can be more optimized with lower queries frequncy
export async function getCanteenOrderDetails(canteen_id, order_id) {
    
    const order_data = await orderModel.getCanteenOrder(canteen_id, order_id);

    if (order_data.length === 0) {
        return {notFound:true};
    }    

    console.log(order_data[0].user_id);
    

    const user_id = order_data[0].user_id;

    const user_info = await userModel.getUser(user_id);

    if (user_info.rowCount === 0) {
        return {notFound:true};
    }

    // return rows of data as a list
    const order_item_data = await orderModel.getOrderItems(order_id);

    const details = {
            order_info : order_data[0],
            user_info : user_info.rows[0],
            items : order_item_data
    }

    return details;
}


export async function getUserOrderHistory(user_id) {
    
    const orders = await orderModel.getAllUserOrders(user_id);

    console.log(orders.rows);
    

    if (orders.rowCount === 0) {
        return [];
    }

    let positions = [];
    let values = [];

    for (const order of orders.rows) {
        positions.push(`$${values.length + 1}`);
        values.push(order.order_id);
    }

    const order_items = await orderModel.getMultipleOrdersItems(positions, values);

    console.log(order_items);

    let order_map = new Map();

    for (const order of orders.rows) {
        order_map.set(order.order_id, {
            ...order,
            items : []
        })
    }

    for (const item of order_items) {
        order_map.get(item.order_id).items.push(item);
    }

    const result = [...order_map.values()];

    return result;
}

export async function getCanteenOrderHistory(canteen_id) {
    const orders = await orderModel.getCanteenOrderHistory(canteen_id);

    if (orders.rowCount === 0) {
        return [];
    }

    let positions = [];
    let values = [];

    for (const order of orders.rows) {
        positions.push(`$${values.length + 1}`);
        values.push(order.order_id);
    }

    const order_items = await orderModel.getMultipleOrdersItems(positions, values);

    let order_map = new Map();

    for (const order of orders.rows) {
        order_map.set(order.order_id, {
            ...order,
            items : []
        })
    }

    for (const item of order_items) {
        order_map.get(item.order_id).items.push(item);
    }

    const result = [...order_map.values()];

    return result;
}


export async function cancelOrderUser(user_id, order_id) {

    const result = await orderModel.cancelOrderUser(user_id, order_id);

    return result;
} 

export async function cancleOrderCanteen(canteen_id, order_id) {

    const result = await orderModel.cancelOrderCanteen(canteen_id, order_id);

    return result;
} 

export async function acceptOrder(user_id, canteen_id, order_id) {

    const result = await orderModel.acceptOrder(user_id, canteen_id, order_id);

    return result;
} 

export async function orderPreparing(canteen_id, order_id) {

    const result = await orderModel.orderPreparing(canteen_id, order_id);

    return result;
} 

export async function orderCompleted(canteen_id, order_id) {

    const result = await orderModel.orderCompleted(canteen_id, order_id);

    return result;
} 