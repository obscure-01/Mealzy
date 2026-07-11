import jwt from "jsonwebtoken";
 
const authenticateUser =  (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message:err.message});
        req.user_id = decoded.user_id;
        req.role = decoded.role;
        req.canteen_id = decoded.canteen_id
        next();
    })
}

export default authenticateUser;