import {findUser} from "../models/refreshTokenModel.js";
import jwt from "jsonwebtoken";
import {compare} from "bcrypt";

export async function createNewToken(req, res) {
    const cookie = req.cookies;
    
    if (!cookie?.jwt) {
        return res.status(403).json({message: "no cookie"});
    }

    const refreshToken = cookie.jwt;

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



