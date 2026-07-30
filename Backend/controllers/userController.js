import * as userModel from "../models/userModel.js";
import {hash} from "bcrypt";
import { uploadImage, deleteImage } from "../services/cloudinaryService.js";
import jwt from "jsonwebtoken";
import fs from "fs";


// do not have a role input in the form
// used in the app
export async function createUser(req, res, next) {
    try {

        // deal with profile picture later, add canteen id
        const {name, email, password, phone_number} = req.body;
        
        if (!name || !email || !password || !phone_number) {
            return res.status(400).json({message: "Required filed missing"});
        }

        const profile_picture = req.file?.path;

        // add more input validation later in the form of middlewares
        
        const user = await userModel.findUserByPhoneNumber(phone_number);        
        
        if (user.rowCount !== 0) {
            return res.status(409).json({message:"User already exist"});
        }

        const password_hash = await hash(password, Number(process.env.NUMBER_OF_SALT_ROUNDS));

        let uploadResult = null;
        if (profile_picture) {
            uploadResult = await uploadImage(profile_picture);
        }        

        console.log(uploadResult);
        console.log(uploadResult?.url, uploadResult?.public_id);
        
        
        const result = await userModel.createUser(name, email, password_hash, phone_number, uploadResult?.url, uploadResult?.public_id);
        
        return res.status(201).json({message: "Created new user"});
    }
    catch (err) {        
        next(err);
    }
    finally {
        if (req?.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}

    
    
export async function updateUser(req, res, next) {
    try {

        const user_id = req.user_id;
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const {name, email, phone_number} = req.body;

        let fields = [];
        let values = [];


        if (typeof name === "string") {
            fields.push(`name = $${values.length+1}`);
            values.push(name);
        }
        if (typeof email === "string") {
            fields.push(`email = $${values.length+1}`);
            values.push(email);
        }
        if (typeof phone_number === "string") {
            fields.push(`phone_number = $${values.length+1}`);
            values.push(phone_number);
        }

        const profile_picture = req.file?.path;

        if (profile_picture) {

            const result = await userModel.getUser(user_id);

            if (result.rowCount === 0) {
                return res.status(404).json({message: "user not found"});
            } 
            const profile_picture_id = result.rows[0].profile_picture_id;
            
            if (profile_picture_id) {
                deleteImage(profile_picture_id);
            }

            const uploadResult = await uploadImage(profile_picture);
            fields.push(`profile_picture = $${values.length+1}`);
            values.push(uploadResult.url);
            fields.push(`profile_picture_id = $${values.length+1}`);
            values.push(uploadResult.public_id);
        }
        
        const result = await userModel.updateUser(user_id, fields, values);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({message: "user info updated"});
    }
    catch (err) {
        next(err);
    }
    finally {
        if (req?.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}

export async function getUser(req, res, next) {
    try {
        const user_id = Number(req.params.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const result = await userModel.getUser(user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }        

        return res.status(200).json({user_info : result.rows[0]});
    }
    catch (err) {
        next(err);
    }
    
}


export async function deleteUser(req, res, next) {
    try {
        const user_id = Number(req.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const result = await userModel.deleteUser(user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({message : "user deleted"});
    }
    catch (err) {
        next(err);
    }
}


export async function changeRoles(req, res, next) {
    try {
        const user_id = Number(req.params.user_id);
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const role = req.body.role;
        const canteen_id = Number(req.body.canteen_id);



        if (typeof role !== "string") {
            return res.status(400).json({message:"Invalid role"});
        }

        if (!Number.isInteger(canteen_id)) {
            return res.status(400).json({message:"Invalid canteen_id"});
        }

        const result = await userModel.changeRoles(role, canteen_id, user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({message: "user role updated"});
    }
    catch (err) {
        next(err);
    }
}


export function test(req, res, next   ) {
    // test more
    return res.sendStatus(200);
    console.log('test successful');

}