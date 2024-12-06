const jwt = require('jsonwebtoken')

const verifyAdminJWT = (req, res, next) => {
    const authHeaders = req.headers.authorization || req.headers.Authorization

    if(!authHeaders?.startsWith('Bearer ')) {
        return res.status(401).json({message: "Unauthorized"})
    }

    const token = authHeaders.split(' ')[1]
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err)
                res.status(403).json({message: err})

            if(decoded.role !== 'ADMIN')
                return res.status(403).json({message: 'Forbidden, only for admin'})

            next()
        }
    )
}

module.exports = verifyAdminJWT