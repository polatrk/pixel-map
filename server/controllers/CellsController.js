const Cells = require("../models/Cells");
const Users = require("../models/Users");
const jwt = require('jsonwebtoken')

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const findAll = async (req, res) => {
    try {
        const cells = await Cells.findAll();
        return res.status(200).json(cells);
    } catch (error) {
        console.error("Error retrieving data:", error);
        return sendErrorResponse(res, 500, "Error retrieving data.");
    }
};

const saveCell = async (req, res) => {
    try {
        const { pos_x, pos_y, color } = req.body;

        const authHeaders = req.headers.authorization || req.headers.Authorization
        if(!authHeaders?.startsWith('Bearer ')) {
            return sendErrorResponse(res, 401, "Unauthorized")
        }

        const token = authHeaders.split(' ')[1]
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const modified_by = decoded.id
        
        if ((!pos_x && pos_x !== 0) || (!pos_y && pos_y !== 0) || !color) {
            return sendErrorResponse(res, 400, "All fields are required.");
        }

        // check if the modifying user exists and is active
        const modifyingUser = await Users.findOne({ where: { id: modified_by } });
        if (!modifyingUser) {
            return sendErrorResponse(res, 404, "Modifying user not found.");
        }

        if (modifyingUser.status === "INACTIVE") {
            return sendErrorResponse(res, 401, "User not active.");
        }

        // check if the cell exists
        const cell = await Cells.findOne({ where: { pos_x, pos_y } });

        if (cell) {
            // update existing cell
            cell.color = color;
            cell.modified_by = modified_by;
            await cell.save();
            return res.status(200).json(cell);
        } else {
            // create a new cell
            const newCell = await Cells.create({ pos_x, pos_y, color, modified_by });
            return res.status(201).json(newCell);
        }
    } catch (error) {
        console.error("Error saving cell:", error);
        return sendErrorResponse(res, 500, "Error saving cell.");
    }
};

const getCellInfos = async (req, res) => {
    try {
        const pos = JSON.parse(decodeURIComponent(req.params.pos));
        if (!pos || typeof pos.pos_x === "undefined" || typeof pos.pos_y === "undefined") {
            return sendErrorResponse(res, 400, "Invalid position data.");
        }

        const cell = await Cells.findOne({
            where: { pos_x: pos.pos_x, pos_y: pos.pos_y },
            include: {
                model: Users,
                attributes: ["username"],
                required: false,
            },
        });

        return res.status(200).json(cell);
    } catch (error) {
        console.error("Error fetching cell info:", error);
        return sendErrorResponse(res, 500, "Error fetching cell info.");
    }
};

module.exports = {
    findAll,
    saveCell,
    getCellInfos,
};
