const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ShoppingList = sequelize.define('ShoppingList', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {  
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'shopping_lists',
    timestamps: true,
});

User.hasMany(ShoppingList, { foreignKey: 'userId' });
ShoppingList.belongsTo(User, { foreignKey: 'userId' });

module.exports = ShoppingList;