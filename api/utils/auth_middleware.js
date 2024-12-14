import jwt from 'jsonwebtoken'; 

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) 
        return res.status(401).json({message: "Not authenticated"});
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded; 
        next();
    }catch(err){
        res.status(401).json({message: "Unauthorized access"});
    }
}

export default authMiddleware;