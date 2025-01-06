import AppError from "../utils/AppError.js"

const verifyRoles = (...allowedRoles) => {
    return (req, res, next)=> {
        if (!req.body?.roleList) 
            throw new AppError("Unauthorized", 401);

        const rolesArray = [...allowedRoles];
        const roleList = req.body.roleList;

        const result = roleList.map(role => rolesArray.includes(role)).find(val => val===true);
        if (!result)
            throw new AppError("Forbidden", 403);
        
        next();
    }
}

export default verifyRoles;