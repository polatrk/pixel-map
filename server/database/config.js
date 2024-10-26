const Sequelize = require('sequelize');

const sequelize = new Sequelize('sql7740928', 'sql7740928', 'k4XFsNaWIy', {
    host: 'sql7.freesqldatabase.com',
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