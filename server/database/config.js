const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root:xJutwDaXJIMhJcTIQPbTmtQOfBMdQejU@junction.proxy.rlwy.net:13650/railway');

sequelize.authenticate()
.then(() => {
    console.log("Connected to the database");
})
.catch(err => {
    console.log("Error while connected to the database : ", err);
});

module.exports = sequelize;