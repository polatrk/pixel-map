const sequelize = require('../database/config');
const { DataTypes } =  require('sequelize');

const Users = sequelize.define(
    'Users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255)
        },
        email: {
            type: DataTypes.STRING(255)
        },
        password: {
            type: DataTypes.STRING(254)
        },
        role: {
            type: DataTypes.STRING(50)
        }
    }, {
        tableName: 'users',
        timestamps: false,
    }
);


module.exports = Users;

