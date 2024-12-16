const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const setCookie = (res, name, value, options = {}) => {
    const defaultOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    };
    res.cookie(name, value, { ...defaultOptions, ...options });
};

const clearCookie = (res, name) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
};

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const cookies = req.cookies;

        if (cookies?.accessToken) {
            return sendErrorResponse(res, 409, "A session is already active.");
        }

        if (!email || !password) {
            return sendErrorResponse(res, 400, "All fields are required.");
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return sendErrorResponse(res, 401, "Email or password incorrect.");
        }

        if (user.status === "INACTIVE") {
            return sendErrorResponse(res, 401, "Please verify your email.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendErrorResponse(res, 401, "Email or password incorrect.");
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "8h" }
        );

        setCookie(res, "refreshToken", refreshToken, { maxAge: 8 * 60 * 60 * 1000 });
        return res.json({ accessToken });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, "Internal Server Error.");
    }
};

const logout = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.accessToken) {
        return res.status(204).send({ message: "No active session." });
    }

    clearCookie(res, "accessToken");
    return res.status(200).json({ message: "Cookie cleared." });
};

const refresh = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.refreshToken) {
            return sendErrorResponse(res, 401, "Unauthorized.");
        }

        const refreshToken = cookies.refreshToken;
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await Users.findOne({ where: { email: decoded.email } });
        if (!user) {
            return sendErrorResponse(res, 403, "Forbidden.");
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ accessToken });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 403, "Forbidden.");
    }
};

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return sendErrorResponse(res, 400, "All fields are required.");
        }

        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return sendErrorResponse(res, 400, "Email is already associated with an account.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await Users.create({
            username,
            email,
            password: hashedPassword,
            role: "USER",
            status: "INACTIVE",
        });

        const token = jwt.sign(
            { id: createdUser.id },
            process.env.VERIFICATION_EMAIL_TOKEN_SECRET
        );

        const url = process.env.NODE_ENV === "production" ? process.env.REACT_APP_URL : process.env.REACT_APP_URL_DEV;
        const transporter = nodemailer.createTransport({
            debug: true,
            host: 'ssl0.ovh.net',
            port: 465,
            secure: true,
            auth: {
              user: process.env.VERIFICATION_EMAIL,
              pass: process.env.VERIFICATION_EMAIL_PASSWORD,
            }
        })

        await transporter.sendMail({
            from: process.env.VERIFICATION_EMAIL,
            to: createdUser.email,
            subject: "Verify your email",
            text: `${url}/verify/?token=${token}`,
        });

        return res.json({ message: "Verification email sent. Please check your mailbox." });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, error);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return sendErrorResponse(res, 400, "Invalid token.");
        }

        const decoded = jwt.verify(token, process.env.VERIFICATION_EMAIL_TOKEN_SECRET);
        const user = await Users.findOne({ where: { id: decoded.id } });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found.");
        }

        user.status = "ACTIVE";
        await user.save();

        return res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        console.error(error);
        return sendErrorResponse(res, 500, "Internal Server Error.");
    }
};

module.exports = {
    login,
    logout,
    refresh,
    signup,
    verifyEmail
};