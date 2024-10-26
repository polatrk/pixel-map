const Sequelize = require('sequelize');

const sequelize = new Sequelize('pixelmap', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
.then(() => {
    console.log("Connected to the database");
})
.catch(err => {
    console.log("Error while connected to the database : ", err);
});

module.exports = sequelize;