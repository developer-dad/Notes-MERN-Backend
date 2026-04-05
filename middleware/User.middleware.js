import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
try {
        // get token from header
        const authHeader = req.headers.authorization
    
        // validate
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "No Token Provided"
            })
        }
    
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        
        next()
} catch (err) {
    return res.status(401).json({
        success: false,
        message: "Invalid or Expired token"
    })
}
}