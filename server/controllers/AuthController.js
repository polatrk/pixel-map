const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asynchHandler = require('express-async-handler')

const login = async (req, res) => {
    const cookies = req.cookies
    if(cookies?.jwt)
        return res.sendStatus(409).send({message: "a session is already active"})

    try {
        const { _email, _password } = req.body
        if(_email != null && _password != null) {
            const user = await Users.findOne({
                where: {
                    email: _email
                }
            })
        if(user != null) {
            bcrypt.compare(_password, user.password, (err, result) => {
                if(result) {
                    const accessToken = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            role: user.role
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' }
                    )

                    const refreshToken = jwt.sign(
                        { email: user.email },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: '8h' }
                    )

                    res.cookie('jwt', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                        maxAge: 8 * 60 * 1000
                    })

                    res.json({accessToken})
                } else {
                    res.status(401).send({message: "email ou password incorrect"});
                }
            })
        } else {
            res.status(401).send({message: "email or password incorrect"});
        }
        }
        else
            res.status(401).send({message: "all fields are required"});
    } catch (error) {
        res.status(400).send({message: error})
    }
};

const refresh = (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    if(!cookies?.jwt)
        return res.status(401).json({message: 'Unothaurized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asynchHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await Users.findOne({ username: decoded.username })

            if (!foundUser) return res.status(400).json({ message: 'Unauthorized' })

                const accessToken = jwt.sign(
                    {
                        id: user.id,
                        email: foundUser.email,
                        username: foundUser.username,
                        role: foundUser.role
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

            res.json({ accessToken })
        })
    )
}

const logout = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt)
        return res.sendStatus(204)

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    })

    res.json({message: 'Cookie cleared'})
}

const signup = async (req, res) => {
    try {
        const { _username, _email, _password } = req.body
        if(_username != null && _email != null && _password != null) {
            const existingUser = await Users.findOne({
                where: {
                    email: _email
                }
            })
            if(existingUser != null)
                res.status(400).send({message: "email is already associated with an account"});
            else {
                bcrypt.hash(_password, 10).then((hash) => {
                    const newUser = Users.create({
                        username: _username,
                        email: _email,
                        password: hash,
                        role: "user"
                    })
                    .then(result => {
                        res.status(200).send(result)
                    })
                })
            }
        }
    } catch (error) {
        res.status(400).send({message: error.message})
    }
};


module.exports = {
    login,
    logout,
    refresh,
    signup
};