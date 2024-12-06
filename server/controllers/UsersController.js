const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const { checkAuthorization } = require('../Utils');

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const update = async (req, res) => {
    try {
        const id = req.params.id;

        if (!checkAuthorization(req, id)) {
            return sendErrorResponse(res, 401, "Unauthorized");
        }

        const { email, username, password } = req.body;

        // fetch the user by ID
        const user = await Users.findOne({ where: { id } });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // udpate fields if they are provided and different
        if (email && email !== user.email) {
            user.email = email;
        }

        if (username && username !== user.username) {
            user.username = username;
        }

        if (password) {
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (!isSamePassword) {
                user.password = await bcrypt.hash(password, 10);
            }
        }

        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        return sendErrorResponse(res, 500, "Error updating user");
    }
};

const findSingle = async (req, res) => {
    try {
        const id = req.params.id;

        if (!checkAuthorization(req, id)) {
            return sendErrorResponse(res, 401, "Unauthorized");
        }

        const user = await Users.findOne({ where: { id } });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        return sendErrorResponse(res, 500, "Error retrieving user");
    }
};

const findAll = async (req, res) => {
    try {
        const users = await Users.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        return sendErrorResponse(res, 500, "Error retrieving users");
    }
};

module.exports = {
    update,
    findSingle,
    findAll,
};
