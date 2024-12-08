import jwt from 'jsonwebtoken'; 

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) 
        return res.status(401).json({message: "invalid token"});
    try{
        jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded; 
        next();
    }catch(err){
        res.status(401).json({message: "Unauthorized access"});
    }
}
