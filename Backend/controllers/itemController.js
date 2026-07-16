// test 0 and negetive numbers

import { json } from "express";
import * as itemModel from "../models/itemModel.js";

export async function createItem(req, res, next) {
    try {

        const canteen_id = req.canteen_id;

        if (!canteen_id) {
            return res.status(400).json({message: "no canteen id found"});
        }

        const {item_name, description, price, image, category, is_vegetarian} = req.body;
        
        // if any data is missing or of the wrong type
        if (typeof item_name !== "string" || typeof description !== "string" || typeof price !== "number" || typeof image !== "string" || typeof category !== "string" || typeof is_vegetarian !== "boolean") {
            return res.status(400).json({message:"necessary fields missing"});
        }
        
        // input validation here
        // price is not 0 or negetive
        // trim item name and description
        // maybe validate category
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

export async function getItem(req, res, next) {
    try {
        const item_id = Number(req.params.item_id);
        
        if (!Number.isInteger(item_id)) {
            return res.status(400).json({message:"item_id must be a number"});      
        }
        
        
        
        const [item] = await itemModel.getItem(item_id);
        
        if (!item) {
            return res.status(404).json({message: "Item not found"});
        }
        
        res.status(200).json({item_data : item});
    }
    catch (err) {
        next(err);
    }
}

export async function updateItem(req, res, next) {
    try {
        const canteen_id = Number(req.canteen_id);

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message: "Invalid Canteen_id"});
        }
        
        const item_id = Number(req.params.item_id);

        if (!Number.isInteger(item_id)) {
            return res.status(400).json({message: "Invalid item_id"});
        }

        const {item_name, description, price, image, category, is_vegetarian, is_available} = req.body;

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

        if (category) {
            fields.push(`category = $${fields.length +  1}`);
            values.push(category);
        }

        if (is_vegetarian !== undefined) {
            fields.push(`is_vegetarian = $${fields.length +  1}`);
            values.push(is_vegetarian);
        }

        if (is_available !== undefined)  {
            fields.push(`is_available = $${fields.length +  1}`);
            values.push(is_available);
        }

        if (image) {
            // implement creating image url
            const image_url = image;
            fields.push(`image_url = $${fields.length +  1}`);
            values.push(image_url);
        }

        if (fields.length === 0) {
            return res.status(400).json({message: "No fields provided"});
        }

        const result = await itemModel.updateItem(item_id, canteen_id, fields, values);

        if (result.rowsCount === 0) {
            return res.status(404).json({message:"Matching item not find"});
        }

        res.status(200).json({message:"item updated"});
    }
    catch (err) {
        next(err)
    }
}

export async function deleteItem(req, res, next) {
    try {

        const canteen_id = Number(req.canteen_id);

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message: "Invalid Canteen_id"});
        }
        
        const item_id = Number(req.params.item_id);

        if (!Number.isInteger(item_id)) {
            return res.status(400).json({message: "Invalid item_id"});
        }

        const result = await itemModel.deleteItem(item_id, canteen_id);

        if (result.rowsCount === 0) {
            return res.status(404).json({message:"item does not exist"});
        }

        return res.status(200).json({message:"Item deleted"});
    }
    catch (err) {
        next(err);
    }
        
}

export async function changeAvailability(req, res, next) {
    try {

        const canteen_id = Number(req.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message: "Invalid Canteen_id"});
        }
        
        const item_id = Number(req.params.item_id);
        
        if (!Number.isInteger(item_id)) {
            return res.status(400).json({message: "Invalid item_id"});
        }
        
        let {is_available} = req.body;  
        
        console.log(is_available);
        
        
        if (typeof is_available !== "boolean") {
            return res.status(400).json({message:"is_available must be a boolean"});
        }
        
        const result = await itemModel.changeItemAvailability(item_id, canteen_id, is_available);
        
        if (result.rowsCount === 0) {
            return res.status(404).json({message:"item does not exist"});
        }
        
        return res.status(200).json({message: `Availability set to ${is_available}`});
    }
    catch (err) {
        next(err);
    }
}