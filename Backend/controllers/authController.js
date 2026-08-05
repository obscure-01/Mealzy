import {compare, hash} from "bcrypt";
import jwt from "jsonwebtoken";
import {randomUUID, verify} from 'crypto';
import {storeToken, findUser, deleteToken} from "../models/refreshTokenModel.js";
import {findUserByPhoneNumber} from "../models/userModel.js";

// used in the app
export async function logIn(req, res, next) {
    
    const {phone_number, password} = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({message: "Required filed missing"});
    }

    const result = await findUserByPhoneNumber(phone_number);    

    if (result.rowCount === 0) {
        return res.status(404).json({message:"User not found"});
    }

    const user_detail = result.rows[0];

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
                    user_id: user_detail.user_id,
                    jti: UUID
                },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'7d'}
            );
            
            const token_hash = await hash(refreshToken, Number(process.env.NUMBER_OF_SALT_ROUNDS));
            
            const token_stored = await storeToken(UUID, token_hash, user_detail.user_id, 7);
            
            // res.cookie('jwt', refreshToken, {httpOnly:true, maxAge: 7 * 24 * 60 * 60 *1000});
            res.status(200).json({"accessToken" : accessToken, "refreshToken": refreshToken});
            
        }        
        
        catch (err) {
            return res.status(400).json({message:err.message});
        }
    }
    else {
        console.log('password did not match');
    }

}

// used in the app
export async function logOut(req, res, next) {
    try {

        const refreshToken = req.body.refreshToken;
        
        // user not logged in
        if (!refreshToken) {        
            return res.sendStatus(204);
        }
        
        let payload = null;
        
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        // cookie has been tampered with, couldn't verify it
        catch (err) {
            console.log('tampered');
            
            return res.sendStatus(203)
        }
        
        const [user] = await findUser(payload.jti);
        
        // cookie has expired, couldn't find it in the database
        if (!user) {
            res.clearCookie('jwt', {httpOnly:true, maxAge: 7 * 24 * 60 * 60 *1000});
            console.log('expired');
            
            return res.sendStatus(203)
        }
        
        const result = await deleteToken(payload.jti);
        
        // res.clearCookie('jwt', {httpOnly:true, maxAge:7*24*60*60*1000});
        return res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
}

// used in the app
export async function createNewToken(req, res, next) {
    try {

        const refreshToken = req.body.refreshToken;
        
        // user not logged in
        if (!refreshToken) {        
            return res.sendStatus(204);
        }
        
        let payload = null;
        
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            
        }
        catch (err) {
            return res.status(403).json({message:err.message});
        }
        
        const [user] = await findUser(payload.jti);    
        
        if (!user) {
            return res.status(403).json({message: "no user"});
        }
        
        const match = compare(refreshToken, user.token_hash);
        
        if (!match) {
            return res.status(403);
        }
        
        const accessToken = jwt.sign({
                user_id: user.user_id,
                canteen_id: user.canteen_id,
                role: user.role
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn:'15m'}
        );
    return res.status(201).json({accessToken});
    }
    catch (err) {
        next(err);
    }
}



