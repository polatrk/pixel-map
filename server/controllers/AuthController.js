const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
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
                    if(user.status === 'INACTIVE')
                        return res.status(401).send({message: "Please verify your email."})

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
                        maxAge: 8 * 60 * 60 * 1000
                    })

                    res.json({accessToken})
                } else {
                    res.status(401).send({message: "Email ou password incorrect"})
                }
            })
        } else {
            res.status(401).send({message: "Email or password incorrect"});
        }
        }
        else
            res.status(401).send({message: "All fields are required"});
    } catch (error) {
        res.status(400).send({message: error})
    }
};

const refresh = (req, res) => {
    const cookies = req.cookies
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
                        id: foundUser.id,
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
        const { _username, _email, _password } = req.body;

        if (!_username || !_email || !_password) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // Check if the user already exists
        const existingUser = await Users.findOne({ where: { email: _email } });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already associated with an account." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(_password, 10);

        // Create the user
        const createdUser = await Users.create({
            username: _username,
            email: _email,
            password: hashedPassword,
            role: "USER",
            status: "INACTIVE"
        });

        // Generate a verification token
        const token = jwt.sign(
            { id: createdUser.id },
            process.env.VERIFICATION_EMAIL_TOKEN_SECRET
        );

        // Configure the mail transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: process.env.VERIFICATION_EMAIL,
                pass: process.env.VERIFICATION_EMAIL_PASSWORD
            }
        });

        // Create the email configuration
        const url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : process.env.REACT_APP_URL_DEV
        const mailConfiguration = {
            from: process.env.VERIFICATION_EMAIL,
            to: createdUser.email,
            subject: 'Pixel-map Email Verification',
            text: `${url}/verify/?token=${token}`
        };

        // Send the verification email
        await transporter.sendMail(mailConfiguration);

        // Respond to the client
        return res.status(200).send({ message: "Please click on the link we sent to your email." });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(498).json({ message: "Invalid token" });
        }

        jwt.verify(
            token,
            process.env.VERIFICATION_EMAIL_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                }

                const foundUser = await Users.findOne({
                    where: {
                        id: decoded.id
                    }
                });

                if (!foundUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                foundUser.status = 'ACTIVE';
                await foundUser.save();

                return res.status(200).json({ message: "Email verified successfully" });
            }
        );
    } catch (error) {
        return res.status(500).json({ message: "Error:", error: error.message });
    }
};



module.exports = {
    login,
    logout,
    refresh,
    signup,
    verifyEmail
};