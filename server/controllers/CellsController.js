const Cells = require('../models/Cells');
const Users = require('../models/Users');

const findAll = async (req, res) => {
    try {
        const result = await Cells.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log("erreur lors de la récupération des données : ", error);
    }
};

const saveCell = async (req, res) => {
    try {
        const { pos_x, pos_y, color, modified_by } = req.body;

        const modifiedByUser = await Cells.findOne({
            where: {
                id: modified_by
            }})

        if(modifiedByUser != null)
            if(modifiedByUser.status === 'INACTIVE')
                return res.status(401).send("User not active")

        const foundCell = await Cells.findOne({
            where: {
                pos_x: pos_x,
                pos_y: pos_y
            }})

        if (foundCell) {
            foundCell.color = color;
            foundCell.modified_by = modified_by;
            
            await foundCell.save();
            return res.status(200).send(foundCell);
        } else {
            const newCell = await Cells.create({
                pos_x: pos_x,
                pos_y: pos_y,
                color: color,
                modified_by: modified_by
            });
            return res.status(201).send(newCell);
        }
    } catch (error) {
        console.log('Error:', error);
        return res.status(400).send(error);
    }
};

const getCellInfos = async (req, res) => {
    try {
        const pos = JSON.parse(decodeURIComponent(req.params.pos));
        const foundCell = await Cells.findOne({
            where: {
                pos_x: pos.pos_x,
                pos_y: pos.pos_y
            },
            include: {
                model: Users,
                attributes: ['username'],
                required: false
        }})

        res.status(200).send(foundCell)
    } catch (error) {
        
    }
}

module.exports = {
    findAll,
    saveCell,
    getCellInfos
};