import * as itemModel from "../models/itemModel.js";
import * as orderService from "../services/orderService.js";

export async function createOrder(req, res, next) {
    try {
        const user_id = Number(req.user_id);

        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"invalid user_id"});
        }

        const canteen_id = Number(req.body.canteen_id)

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        const items = req.body.items;

        // store in arrays to get items
        let positions = [];
        let values = [];

        for (let item in items) {
            const item_id = Number(item);
            if (!Number.isInteger(item_id)) {
                return res.status(400).json({message:"invalid user_id"});
            }
            values.push(item_id);
            positions.push(`$${values.length}`);
        }

        const result = await itemModel.getMultipleItems(positions, values);
        
        // check if there are exact number of items that were ordered or not
        if (result.length === 0 || result.length !== Object.keys(items).length) {
            return res.status(404).json({message:"some items not found"});
        }

        let total_price = 0;
        
        let order_items = [];

        for (const item of result) {
            const item_qty = Number(items[item["item_id"]]);            

            if (!Number.isInteger(item_qty)) {
                return res.status(400).json({message:"Invalid qunatity"}); 
            }

            total_price += item_qty * Number(item["price"]);
            
            const new_item = item;
            new_item.quantity = item_qty;
            order_items.push(new_item);
        }

        await orderService.createOrder([user_id, canteen_id, total_price], order_items);

        return res.status(200).json({message: "order placed"});

    }
    catch (err) {
        next(err);
    }
    
}

export async function getUserOrder(req, res, next) {
    try {

        const user_id = Number(req.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }
        
        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const order = await orderService.getUserOrderDetails(user_id, order_id);
        
        if (order.notFound) {
            return res.status(404).json({message:"order not found"});
        }
        
        return res.status(200).json({"order" : order}); 
    }
    catch (err) {
        next(err);
    }
}

export async function getCanteenOrder(req, res, next) {
    try {

        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const order = await orderService.getCanteenOrderDetails(canteen_id, order_id);
        
        if (order.notFound) {
            return res.status(404).json({message:"order not found"});
        }
        
        return res.status(200).json({"order" : order}); 
    }
    catch (err) {
        next(err);
    }

}

export async function getUserOrderHistory(req, res, next) {
    try {
        const user_id = Number(req.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const orders = await orderService.getUserOrderHistory(user_id);

        if (orders.length === 0) {
            return res.status(404).json({message:"No orders placed yet"});
        }

        return res.status(200).json({order_history : orders});

    }
    catch (err) {
        next(err);
    }
}

export async function getCanteenOrderHistory(req, res, next) {
    try {
        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        const orders = await orderService.getCanteenOrderHistory(canteen_id);

        if (orders.length === 0) {
            return res.status(404).json({message:"No orders placed yet"});
        }

        return res.status(200).json({order_history : orders});

    }
    catch (err) {
        next(err);
    }
}

export async function cancleOrderUser(req, res, next) {
 
    const user_id = Number(req.user_id);

    if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
    }
    
    const order_id = Number(req.params.order_id);
        
    if (!Number.isInteger(order_id)) {
        return res.status(400).json({message:"Invalid order_id"});
    }

    const result = await orderService.cancelOrderUser(user_id, order_id);

    if (result.rowCount === 0) {
        return res.status(403).json({message:"Could not cancel order"});
    }

    return res.status(200).json({message:"Order canceled"});
}

export async function cancleOrderCanteen(req, res, next) {
    try {

        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const result = await orderService.cancleOrderCanteen(canteen_id, order_id);
        
        if (result.rowCount === 0) {
            return res.status(403).json({message:"Could not cancel order"});
        }
        
        return res.status(200).json({message:"Order canceled"});
    }
    catch (err) {
        next(err);
    }
}

export async function acceptOrder(req, res, next) {
    try {

        const user_id = Number(req.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }
        
        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const result = await orderService.acceptOrder(user_id, canteen_id, order_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message:"order not found"});
        }
    
        return res.status(200).json({message:"Order accepted"});

    }
    catch (err) {
        next(err);
    }
}

export async function orderPreparing(req, res, next) {
    try {

        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const result = await orderService.orderPreparing(canteen_id, order_id);
        
        if (result.rowCount === 0) {
            return res.status(403).json({message:"Could not start preparing order"});
        }
        
        return res.status(200).json({message:"Order is being preparing now"});
    }
    catch (err) {
        next(err);
    }
}

export async function orderCompleted(req, res, next) {
    try {

        const order_id = Number(req.params.order_id);
        
        if (!Number.isInteger(order_id)) {
            return res.status(400).json({message:"Invalid order_id"});
        }
        
        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const result = await orderService.orderCompleted(canteen_id, order_id);
        
        if (result.rowCount === 0) {
            return res.status(403).json({message:"Could not complete order"});
        }
        
        return res.status(200).json({message:"Order completed"});
    }
    catch (err) {
        next(err);
    }
}