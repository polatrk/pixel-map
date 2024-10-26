const sequelize = require('../database/config');
const { DataTypes } =  require('sequelize');

const DrawingBoard = sequelize.define(
    'DrawingBoard',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        property: {
            type: DataTypes.STRING(50)
        },
        value: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'drawing_board',
        timestamps: false,
    }
);

module.exports = DrawingBoard;

