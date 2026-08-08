import { json } from "express";
import fs from "fs";
import * as itemModel from "../models/itemModel.js";
import { uploadImage, deleteImage } from "../services/cloudinaryService.js";

// used in the app
export async function createItem(req, res, next) {
    try {

        const canteen_id = req.canteen_id;
        
        if (!canteen_id) {
            return res.status(400).json({message: "no canteen id found"});
        }
        
        let {item_name, description, price, category, is_vegetarian} = req.body;
        
        if (is_vegetarian?.toLowerCase() === "true") {
            is_vegetarian = true;
        }
        else if (is_vegetarian?.toLowerCase() === "false") {
            is_vegetarian = false;
        }
        else {
            is_vegetarian = undefined;
        }
                

        // if any data is missing or of the wrong type
        if (typeof item_name !== "string" || typeof description !== "string" || typeof price !== "string" || typeof category !== "string" || is_vegetarian === undefined) {
            
            return res.status(400).json({message:"necessary fields missing"});
        }

        const image = req.file?.path;        

        let uploadResult = null;
        if (image) {
            uploadResult = await uploadImage(image);
        }        
        
        // input validation here
        // price is not 0 or negetive
        // trim item name and description
        // maybe validate category
        
        await itemModel.createItem(canteen_id, item_name, description, price, uploadResult?.url, uploadResult?.public_id, category, is_vegetarian);
        
        res.status(201).json({message:"Created new item"})
    }
    catch (err) {
        next(err);
    }
    finally {
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}

// used in the app
export async function getItem(req, res, next) {
    try {
        const item_id = Number(req.params.item_id);
        
        if (!Number.isInteger(item_id)) {
            return res.status(400).json({message:"item_id must be a number"});      
        }
        
        const item = await itemModel.getItem(item_id);
        
        if (item.length === 0) {
            return res.status(404).json({message: "Item not found"});
        }
        
        res.status(200).json({item_data : item[0]});
    }
    catch (err) {
        next(err);
    }
}

export const findItems = async (req, res, next) => {
    try {
        const { search } = req.query;

        if (search.length === 0) {
            return res.status(400).json({message : "No search query provided"});
        }

        const keyword = `%${search}%`;

        const result = await itemModel.findItems(keyword);

        return res.status(200).json({items : result});

    }
    catch (err) {
        next(err);
    }
}

// used in the app
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

        let {item_name, description, price, category, is_vegetarian, is_available} = req.body;

        const image = req.file?.path;

        let fields = [];
        let values = [];


        if (typeof item_name === "string") {
            fields.push(`item_name = $${fields.length +  1}`);
            values.push(item_name);
        }
        
        if (typeof description === "string") {
            fields.push(`description = $${fields.length +  1}`);
            values.push(description);
        }

        if (price !== undefined) {
            fields.push(`price = $${fields.length +  1}`);
            values.push(price);
        }

        if (typeof category === "string") {
            fields.push(`category = $${fields.length +  1}`);
            values.push(category);
        }

        if (is_vegetarian?.toLowerCase() === "true") {
            is_vegetarian = true;
        }
        else if (is_vegetarian?.toLowerCase() === "false") {
            is_vegetarian = false;
        }
        else {
            is_vegetarian = undefined;
        }

        if (is_vegetarian !== undefined) {
            fields.push(`is_vegetarian = $${fields.length +  1}`);
            values.push(is_vegetarian);
        }

        if (is_available?.toLowerCase() === "true") {
            is_available = true;
        }
        else if (is_available?.toLowerCase() === "false") {
            is_available = false;
        }
        else {
            is_available = undefined;
        }

        if (is_available !== undefined)  {
            fields.push(`is_available = $${fields.length +  1}`);
            values.push(is_available);
        }

        if (image) {
            const itemRows = await itemModel.getItem(item_id);

            if (itemRows.length === 0) {
                return res.status(404).json({message: "Item not found"});
            }

            const image_id = itemRows[0].image_id;
            if (image_id) {
                await deleteImage(image_id);
            }
            
            const uploadResult = await uploadImage(image);
            
            fields.push(`image_url = $${fields.length +  1}`);
            values.push(uploadResult?.url);
            fields.push(`image_id = $${fields.length +  1}`);
            values.push(uploadResult?.public_id);
        }

        if (fields.length === 0) {
            return res.status(400).json({message: "No fields provided"});
        }

        const result = await itemModel.updateItem(item_id, canteen_id, fields, values);

        if (result.rowCount === 0) {
            return res.status(404).json({message:"Matching item not find"});
        }

        res.status(200).json({message:"item updated"});
    }
    catch (err) {
        next(err)
    }
    finally {
        if (req.file?.path) {
            try {
                fs.unlinkSync(req.file.path);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}


// used in the app
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

        if (result.rowCount === 0) {
            return res.status(404).json({message:"item does not exist"});
        }

        return res.status(200).json({message:"Item deleted"});
    }
    catch (err) {
        next(err);
    }
        
}

// used in the app
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
        
        if (typeof is_available !== "boolean") {
            return res.status(400).json({message:"is_available must be a boolean"});
        }
        
        const result = await itemModel.changeItemAvailability(item_id, canteen_id, is_available);
        
        if (result.rowCount === 0) {
            return res.status(404).json({message:"item does not exist"});
        }
        
        return res.status(200).json({message: `Availability set to ${is_available}`});
    }
    catch (err) {
        next(err);
    }
}