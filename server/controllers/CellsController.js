const Cells = require('../models/Cells');

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
        const { _pos_x, _pos_y, _color } = req.body
        const foundCell = await Cells.findOne({
            where: {
                pos_x: _pos_x,
                pos_y: _pos_y
            }
        })

        if(foundCell) {
            foundCell.color = _color
            await foundCell.save()
            return res.status(200).send(foundCell);
        }
        else {
            const newCell = await Cells.create({
                pos_x: _pos_x,
                pos_y: _pos_y,
                color: _color
            });
            return res.status(201).send(newCell);
        }
    } catch(error) {
        console.log('error', error)
        return res.status(400).send(error)
    }
}

module.exports = {
    findAll,
    saveCell
};