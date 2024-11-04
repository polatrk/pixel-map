const sequelize = require('../database/config');
const { DataTypes } =  require('sequelize');
const Users = require('./Users');

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
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            }
        }
    }, {
        tableName: 'cells',
        timestamps: false,
    }
);

Cells.belongsTo(Users, { foreignKey: 'modified_by', allowNull: true});

module.exports = Cells;

