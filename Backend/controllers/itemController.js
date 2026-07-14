import * as itemModel from "../models/itemModel.js";

export async function createItem(req, res) {
    try {

        const canteen_id = req.canteen_id;

        if (!canteen_id) {
            return res.status(400).json({message: "no canteen id found"});
        }

        const {item_name, description, price, image, category, is_vegetarian} = req.body;
        
        if (!item_name || !description || !price || !image || !category || !is_vegetarian) {
            return res.status(400).json({message:"necessary fields missing"});
        }
        
        // input validation here

        // 
        
        // create image url here
        const image_url = image;

        const result = await itemModel.createItem(canteen_id, item_name, description, price, image_url, category, is_vegetarian);
        
        res.status(201).json({message:"Created new item"})
    }
    catch (err) {
        next(err);
    }
}

export async function getItem(req, res) {
    try {
        const {item_id} = req.params;
        
        if (!item_id) {
            return res.status(400).json({message:"necessary fields missing"});       
        }
        
        const [item] = await itemModel.getItem(item_id);
        
        if (!item) {
            return res.status(404).json({message: "Item not found"});
        }
        
        res.status(200).json(item);
    }
    catch (err) {
        next(err);
    }
}

export async function updateItem(req, res) {
    try {
        const canteen_id = req.canteen_id;

        if (!canteen_id) {
            return res.status(400).json({message: "no canteen id found"});
        }

        const {item_id} = req.params;

        if (!item_id) {
            return res.status(400).json({message: "Update item not specified"});
        }

        const item = await itemModel.getItem(item_id);

        if (!item) {
            return res.status(404).json({message:"Update item not found"});
        }

        if (canteen_id != item.canteen_id) {
            return res.sendStatus(403);
        }

        const {item_name, description, price, image, category, is_vegetarian} = req.body;

        let fields = [];
        let values = [];


        if (item_name) {
            fields.push(`item_name = $${fields.length +  1}`);
            values.push(item_name);
        }
        
        if (description) {
            fields.push(`description = $${fields.length +  1}`);
            values.push(description);
        }

        if (price !== undefined) {
            fields.push(`price = $${fields.length +  1}`);
            values.push(price);
        }

        if (price !== undefined) {
            fields.push(`price = $${fields.length +  1}`);
            values.push(price);
        }
    }
    catch (err) {
        next(err)
    }
}