const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const Item = sequelize.define('Item', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    category: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'items',
    timestamps: true,
});

Item.belongsTo(User, { foreignKey: 'sellerId', as: 'user' });

module.exports = Item;