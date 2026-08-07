// add get all canteens

import * as canteenModel from "../models/canteenModel.js";
import { uploadImage, deleteImage } from "../services/cloudinaryService.js";

// only available to the admin
// not used in the app
export async function createCanteen(req, res, next) {
    try {

            const {canteen_name, canteen_location, opening_time, closing_time} = req.body;
        
            // test for garbage data mainly
            if (typeof canteen_name !== "string" ||
                typeof canteen_location!== "string" ||
                typeof opening_time!== "string" ||
                typeof closing_time !== "string") {
                    
                    return res.status(400).json({message:"Invalid data"});
            }

            const image = req.file?.path;        

            let uploadResult = null;

            if (image) {
                uploadResult = await uploadImage(image);
            }  
            
            await canteenModel.createCanteen(canteen_name, canteen_location, opening_time, closing_time, uploadResult.url, uploadResult.public_id);
            
            return res.status(200).json({message:"New canteen created"})
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

// available to admin and vendor
// used in the app
export async function updateCanteen(req, res, next) {
    try {

        let canteen_id = Number(req.canteen_id);
        
        if (canteen_id === 0 && req.role === "admin") {
            canteen_id = Number(req.params.canteen_id);
        }

        if (!Number.isInteger(canteen_id)) {
            
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const {canteen_name, canteen_location, opening_time, closing_time} = req.body;
        
        const image = req.file?.path;

        let fields = [];
        let values = [];
        
        if (typeof canteen_name === "string" ) {
            fields.push(`canteen_name = $${fields.length+1}`);
            values.push(canteen_name);
        }
        
        if (typeof canteen_location === "string"  ) {
            fields.push(`canteen_location = $${fields.length+1}`);
            values.push(canteen_location);
        }
        
        if (typeof opening_time === "string"  ) {
            fields.push(`opening_time = $${fields.length+1}`);
            values.push(opening_time);
        }
        
        if (typeof closing_time === "string"  ) {
            fields.push(`closing_time = $${fields.length+1}`);
            values.push(closing_time);
        }

        if (image) {
            const itemRows = await canteenModel.getCanteen(canteen_id);

            if (itemRows.length === 0) {
                return res.status(404).json({message: "canteen not found"});
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
        
        const result = await canteenModel.updateCanteen(canteen_id, fields, values);
        
        if (result.rowsCount === 0) {
            return res.status(404).json({message:"Canteen not found"});
        }
        
        return res.status(200).json({message:"Canteen updated"});
    }
    catch (err) {
        next (err);
    }

}

// available to all 
// used in the app
export async function getCanteen(req, res, next) {
    try {

        const canteen_id = Number(req.params.canteen_id);
        
        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const result = await canteenModel.getCanteen(canteen_id);

        if (result.length === 0) {
            return res.status(404).json({message:"Canteen not found"});
        }
        
        return res.status(200).json({canteen_data : result[0]});
    }
    catch (err) {
        next(err);
    }
}
    // available to admin
    // used in app
export async function deleteCanteen(req, res, next) {
    try {

        let canteen_id = Number(req.canteen_id);
        
        if (canteen_id === 0 && req.role === "admin") {
            canteen_id = Number(req.params.canteen_id);
        }

        if (!Number.isInteger(canteen_id)) {
            
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const result = await canteenModel.deleteCanteen(canteen_id);        
        
        if (result.rowCount === 0) {
            return res.status(404).json({message:"Canteen not found"});
        }
        
        return res.status(200).json({message:"Canteen deleted"});
    }
    catch (err) {
        next(err);
    }
    
}   

// available to admin and vendor
export async function openCanteen(req, res, next) {
    try {
        
        let canteen_id = Number(req.canteen_id);
        
        if (canteen_id === 0 && req.role === "admin") {
            canteen_id = Number(req.params.canteen_id);
        }

        if (!Number.isInteger(canteen_id)) {
            
            return res.status(400).json({message:"Invalid canteen_id"});
        }
        
        const {is_open} = req.body;
        
        if (typeof is_open !== "boolean") {
            return res.status(400).json({message: "is_open must be boolean"});
        }
        
        const result = await canteenModel.openCanteen(canteen_id, is_open);
        
        if (result.rowCount === 0) {
            return res.status(404).json({message:"Canteen not found"});
        }
        
        return res.status(200).json({message:`Canteen open: ${is_open}`});
    }
    catch (err) {
        next(err);
    }
        
}

export async function getAllCanteens(req, res, next) {
    try {
        
        const result = await canteenModel.getAllCanteens();

        if (result.length === 0) {
            return res.status(404).json({message:"Canteens not found"});
        }
        
        return res.status(200).json({canteen_data : result});
    }
    catch (err) {
        next(err);
    }
}