import * as userModel from "../models/userModel.js";
import {storeToken} from "../models/refreshTokenModel.js"
import {hash, compare} from "bcrypt";
import jwt from "jsonwebtoken";
import {randomUUID} from 'crypto';

// do not have a role input in the form
export async function createUser(req, res) {
    // deal with profile picture later, add canteen id
    const {name, email, password, phone_number, role} = req.body;

    if (!name || !email || !password || !phone_number || !role) {
        return res.status(400).json({message: "Required filed missing"});
    }

    // add more input validation later in the form of middlewares

    const [user] = await userModel.findUserPhoneNumber(phone_number);

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

export async function login(req, res) {
    
    const {phone_number, password} = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({message: "Required filed missing"});
    }

    const [user_detail] = await userModel.findUserPhoneNumber(phone_number);

    console.log(user_detail);
    

    if (!user_detail) {
        return res.status(404).json({message:"User not found"});
    }
    // implement password validation here
    const match = await compare(password, user_detail.password_hash);

    if (match) {

        try {

            const accessToken = jwt.sign({
                user_id: user_detail.user_id,
                role:user_detail.role,
                canteen_id: user_detail.canteen_id
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'15m'}
            );
        
        
            const UUID = randomUUID();

            const refreshToken = jwt.sign({
                    user_id: user_detail,
                    jti: UUID
                },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'7d'}
            );
            
            const token_hash = await hash(refreshToken, Number(process.env.NUMBER_OF_SALT_ROUNDS));
            
            const token_stored = await storeToken(UUID, token_hash, user_detail.user_id, 7);
            
            res.cookie('jwt', refreshToken, {httpOnly:true, maxAge: 7 * 24 * 60 * 60 *1000});
            res.status(200).json({accessToken});
            
        }        
        
        catch (err) {
            return res.status(400).json({message:err.message});
        }
    }
    else {
        console.log('password did not match');
    }

}


export function test(req, res) {
    // test more
    return res.sendStatus(200);
    console.log('test successful');

}