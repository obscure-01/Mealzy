import * as userModel from "../models/userModel.js";
import {hash} from "bcrypt";
import jwt from "jsonwebtoken";

// do not have a role input in the form
export async function createUser(req, res) {
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

    try {
        const password_hash = await hash(password, Number(process.env.NUMBER_OF_SALT_ROUNDS));
        // process user profile picture here
        const result = await userModel.createUser(name, email, password_hash, phone_number, role);
        
        return res.status(201).json({message: "Created new user"});
    }
    catch (err) {
        res.status(500).json({message:err.message});
    }
    
}




export function test(req, res) {
    // test more
    return res.sendStatus(200);
    console.log('test successful');

}