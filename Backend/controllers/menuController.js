import * as menuModel from "../models/menuModel.js";

// used in the app
export async function getAvailableMenu(req, res, next) {
    try {
        let canteen_id = Number(req.params.canteen_id); 

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        const result = await menuModel.getAvailableMenu(canteen_id);

        if (result.length === 0) {
            return res.status(404).json({message:"no available items found"});
        }

        return res.status(200).json({menu : result});
    }
    catch (err) {
        next(err);
    }
}

// how does the admin access use this if the canteen_id is attached to the JWT
// solved add middleware that assigns add canteen id to the req
// used in the app
export async function getCompleteMenu(req, res, next) {
    try {
        const canteen_id = Number(req.canteen_id);        

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        const result = await menuModel.getCompleteMenu(canteen_id);

        if (result.length === 0) {
            return res.status(404).json({message:"no available items found"});
        }

        return res.status(200).json({menu : result});
    }
    catch (err) {
        next(err);
    }
}

// used in the app
export async function updateMenu(req, res, next) {
    try {
        const canteen_id = Number(req.canteen_id);

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        // stored as [ [item_id, value] ]
        const items = req.body.items;

        let position = [];
        let values = [];

        for (let i = 0; i < items.length; i++) {
            position.push(`($${i*2 + 1}, $${i*2 + 2})`);

            const item_id = Number(items[i][0]);
            const is_available = items[i][1];

            if (!Number.isInteger(item_id)) {
                return res.status(400).json({message:"invalid item_id"});
            }
            if (typeof is_available !== "boolean") {
                return res.status(400).json({message:"is_available must be a boolean"});
            }
            values.push(item_id, is_available);
        }

        const result = await menuModel.updateMenu(canteen_id, position, values);

        if (result.rowsCount === 0) {
            return res.status(404).json({message:"no available items found"});
        }

        return res.status(200).json({message:`updated ${result.rowsCount} items`});
    }
    catch (err) {
        next(err);
    }
}