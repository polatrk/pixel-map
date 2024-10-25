const DrawingBoard = require('../models/DrawingBoard');

const findProperty = async (req, res) => {
    try {
        const _property = req.params.property
        
        const result = await DrawingBoard.findOne({
            where: {
                property: _property
            }
        });
        res.status(200).send(result.value);
    } catch (error) {
        console.log("error getting property : ", error);
    }
};

const saveProperty = async (req, res) => {
    try {
        const _property = req.params.property
        const { value } = req.body
        
        const foundProperty = await DrawingBoard.findOne({
            where: {
                property: _property
            }
        })

        if(foundProperty) {
            if(value != null) {
                foundProperty.value = JSON.stringify(value)
                foundProperty.save()
                res.status(201).send(foundProperty);
            }

        }
    } catch(error) {
        console.log('error', error)
        res.status(400).send(error)
    }
}

module.exports = {  
    findProperty,
    saveProperty
};