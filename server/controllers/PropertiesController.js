const DrawingBoard = require('../models/DrawingBoard');

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

const findProperty = async (req, res) => {
    try {
        const property = req.params.property;

        if (!property) {
            return sendErrorResponse(res, 400, "Property name is required.");
        }

        const result = await DrawingBoard.findOne({
            where: {
                property: property
            }
        });

        if (!result) {
            return sendErrorResponse(res, 404, `Property '${property}' not found.`);
        }

        return res.status(200).send(result.value);
    } catch (error) {
        console.error("Error retrieving property:", error);
        return sendErrorResponse(res, 500, "Error retrieving property.");
    }
};

const saveProperty = async (req, res) => {
    try {
        const property = req.params.property;
        const { value } = req.body;

        if (!property) {
            return sendErrorResponse(res, 400, "Property name is required.");
        }

        if (value == null) {
            return sendErrorResponse(res, 400, "Value is required.");
        }

        // check if the property already exists
        const foundProperty = await DrawingBoard.findOne({ where: { property: property } });

        if (foundProperty) {
            // update the existing property
            foundProperty.value = JSON.stringify(value);
            await foundProperty.save();
            return res.status(200).json({ message: "Property updated successfully.", property: foundProperty });
        } else {
            // create a new property
            const newProperty = await DrawingBoard.create({ property, value: JSON.stringify(value) });
            return res.status(201).json({ message: "Property created successfully.", property: newProperty });
        }
    } catch (error) {
        console.error("Error saving property:", error);
        return sendErrorResponse(res, 500, "Error saving property.");
    }
};

module.exports = {
    findProperty,
    saveProperty,
};
