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
            console.log(item_qty);
            

            if (!Number.isInteger(item_qty)) {
                console.log("found");
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
    
    const user_id = Number(req.user_id);

    if (!Number.isInteger(user_id)) {
        return res.status(400).json({message:"Invalid user_id"});
    }
    
    const order_id = Number(req.params.order_id);

    if (!Number.isInteger(order_id)) {
        return res.status(400).json({message:"Invalid order_id"});
    }
}

export async function getCanteenOrder(req, res, next) {
    
    const canteen_id = Number(req.canteen_id);

    if (!Number.isInteger(canteen_id)) {
        return res.status(400).json({message:"Invalid canteen_id"});
    }
    
    const order_id = Number(req.params.order_id);

    if (!Number.isInteger(order_id)) {
        return res.status(400).json({message:"Invalid order_id"});
    }



}

export async function getUserOrderHistory(req, res, next) {
    
}

export async function getCanteenOrderHistory(req, res, next) {
    
}

export async function cancleOrder(req, res, next) {
    
}

export async function acceptOrder(req, res, next) {
    
}