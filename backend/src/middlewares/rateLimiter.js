import { rateLimit } from "../config/redis.js"

export const rateLimiter = async (req,res,next)=>{
    try {
        const {success} = await rateLimit.limit('my-rate-limit')
        if(!success){
            return res.status(429).json({message:"Too many requests"})
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
}