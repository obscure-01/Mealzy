import * as userModel from "../models/userModel.js";
import {hash} from "bcrypt";
import jwt from "jsonwebtoken";

// do not have a role input in the form
// used in the app
export async function createUser(req, res, next) {
    try {

        // deal with profile picture later, add canteen id
        const {name, email, password, phone_number, role} = req.body;
        
        if (!name || !email || !password || !phone_number || !role) {
            return res.status(400).json({message: "Required filed missing"});
        }
        
        // add more input validation later in the form of middlewares
        
        const [user] = await userModel.findUserByPhoneNumber(phone_number);
        
        console.log(user);
        
        
        if (user) {
            return res.status(409).json({message:"User already exist"});
        }
        
        const password_hash = await hash(password, Number(process.env.NUMBER_OF_SALT_ROUNDS));
        // process user profile picture here
        const result = await userModel.createUser(name, email, password_hash, phone_number, role);
        
        return res.status(201).json({message: "Created new user"});
    }
    catch (err) {
        // delete saved profile picture if error occured
        next(err);
    }
}

    
    
export async function updateUser(req, res, next) {
    try {

        const user_id = req.user_id;
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const {name, email, phone_number, profile_picture} = req.body;

        let fields = [];
        let values = [];


        if (typeof name === "string") {
            fields.push(`name = $${values+1}`);
            values.push(name);
        }
        if (typeof email === "string") {
            fields.push(`email = $${values+1}`);
            values.push(email);
        }
        if (typeof phone_number === "string") {
            fields.push(`phone_number = $${values+1}`);
            values.push(phone_number);
        }
        if (typeof profile_picture === "string") {
            // implement image saving 
            const profile_picture_url = profile_picture;
            fields.push(`profile_picture = $${values.length+1}`);
            values.push(profile_picture_url);
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
}

export async function getUser(req, res, next) {
    try {
        const user_id = req.params.user_id;
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const [result] = await userModel.getUser(user_id);

        if (result.length === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({user_info : result});
    }
    catch (err) {
        next(err);
    }
}


export async function deleteUser(req, res, next) {
    try {
        const user_id = req.user_id;
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const result = await userModel.deleteUser(user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({user_info : result});
    }
    catch (err) {
        next(err);
    }
}


export async function changeRoles(req, res, next) {
    try {
        const user_id = req.params.user_id;
        
        if (!Number.isInteger(user_id)) {
            return res.status(400).json({message:"Invalid user_id"});
        }

        const {role} = req.body;

        if (typeof role !== "string") {
            return res.status(400).json({message:"Invalid role"});
        }

        const result = await userModel.changeRoles(role, user_id);

        if (result.rowCount === 0) {
            return res.status(404).json({message: "user not found"});
        }

        return res.status(200).json({user_info : result});
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