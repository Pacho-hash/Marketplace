const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('university_marketplace', 'root', 'phpmyadmin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,  
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
