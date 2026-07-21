import * as itemModel from "../models/itemModel.js";
import * as orderService from "../services/orderService.js";

// req = {
//      user_id,
// 	    bodt : { order : {
//          canteen_id,
// 		    items : {
//             "2" : 4,
//             "3" : 1
//           }
//        }
//     }   
// }

//     orders
//     user_id 
//     canteen_id 
//     total_price  


//     order_items
//     order_id 
//     item_id 
//     quantity 
//     price_at_order 


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
            const item = Number(item);
            if (!Number.isInteger(item)) {
                return res.status(400).json({message:"invalid user_id"});
            }
            values.push(item);
            positions.push(`$${values.length}`);
        }

        const result = await itemModel.getMultipleItems(positions, values);
        
        // check if there are exact number of items that were ordered or not
        if (result.length === 0 || result.length !== Object.keys(items).length) {
            return res.status(404).json({message:"some items not found"});
        }

        let total_price = 0;

        // create a new array which has result items and attach the quantity to it
        
        let order_items = [];

        result.forEach(item => {
            const item_qty = Number(items[item["item_id"]]);

            if (typeof item_qty !== "number") {
                return res.status(400).json({message:"Invalid qunatity"}); 
            }

            total_price += item_qty * Number(item[price]);
            
            const new_item = item;
            new_item.quantity = item_qty;
            order_items.push(new_item);
        });

        await orderService([user_id, canteen_id, total_price], order_items);

    }
    catch (err) {
        next(err);
    }
    
}