const sequelize = require('../database/config');
const { DataTypes } =  require('sequelize');

const Cells = sequelize.define(
    'Cells',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pos_x: {
            type: DataTypes.INTEGER
        },
        pos_y: {
            type: DataTypes.INTEGER
        },
        color: {
            type: DataTypes.STRING(254)
        }
    }, {
        tableName: 'cells',
        timestamps: false,
    }
);

module.exports = Cells;

