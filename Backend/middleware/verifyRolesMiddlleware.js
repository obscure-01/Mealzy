const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.role) {
            return res.sendStatus(401);
        }
        const role = req.role;

        const rolesArray = [...allowedRoles];

        if (!rolesArray.includes(role)) {
            return res.status(403).json({message:"User does not have permission"});
        }
        next();
    }
}

export default verifyRoles;