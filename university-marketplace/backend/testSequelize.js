const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('university_marketplace', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
