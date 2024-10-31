const jwt = require('jsonwebtoken')

const checkAuthorization = (req, userID) => {
        const authHeaders = req.headers.authorization || req.headers.Authorization
        if(!authHeaders?.startsWith('Bearer ')) {
            return false
        }
        const token = authHeaders.split(' ')[1]
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                console.log(decoded)
                if(err) {
                    console.log(err)
                    return false
                }
    
                if(decoded.id !== userID && decoded.role !== 'admin')
                    return false
            }
        )

        return true
} 

module.exports = {
    checkAuthorization
};