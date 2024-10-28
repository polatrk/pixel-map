const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const cookies = req.cookies
    if(cookies?.jwt)
        return res.sendStatus(409).send({"error": "a session is already active"})

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
                            email: user.email,
                            role: user.role,
                            username: user.username
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '1d' }
                    )

                    res.cookie('jwt', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                        maxAge: 24 * 60 * 60 * 1000
                    })

                    res.json({accessToken})
                } else {
                    res.status(401).send({"error": "email ou password incorrect"});
                }
            })
        } else {
            res.status(401).send({"error": "email or password incorrect"});
        }
        }
    } catch (error) {
        res.status(400).send({"error": error})
    }
};

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
                res.status(400).send({"error": "email is already associated with an account"});
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
        res.status(400).send({"error": error.message})
    }
};


module.exports = {
    login,
    logout,
    signup
};