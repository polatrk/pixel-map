const Users = require('../models/Users');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { checkAuthorization } = require('../Utils')

const update = async (req, res) => {
    try {
        const id = req.params.id;

        if(!checkAuthorization(req, id))
            return res.status(401).send({message: "Unhautorized"})

        const {email, username, password} = req.body;
        const user = await Users.findOne({
            where: {
                id: id
            }
        });

        username === user.username ? null : username
        password === user.password ? null : password
        
        if (user) {
            if (email != null) {
                user.email = email;
                console.log('EMAILLLLL')
            }
            if (username != null) {
                user.username = username;
                console.log('USERNAMMMEEE')
            }
            if (password != null) {
                bcrypt.hash(password, 10).then((hash) => {
                    user.password = hash;
                });
            }
            user.save();
            res.status(200).send(user)

        } else {
            res.status(400).send({message: "User not found"})
        }
    } catch (error) {
        res.status(400).send({message: error})
    }
}

const findSingle = async (req, res) => {
    try {
        const id = req.params.id

        if(!checkAuthorization(req, id))
            return res.status(401).send({message: "Unhautorized"})

        const result = await Users.findOne({where: {id: id}});
        res.status(200).send(result);
    } catch (error) {
        console.log("error getting data : ", error);
    }
};

const findAll = async (req, res) => {
    try {
        const result = await Users.findAll();
        res.status(200).send(result);
    } catch (error) {
        console.log("error getting data : ", error);
    }
};

module.exports = {  
    update,
    findSingle,
    findAll
};