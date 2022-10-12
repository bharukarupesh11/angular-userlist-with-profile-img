// const Sequelize = require('sequelize');
// const sequelize = require('../db/database');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        file: {
            type: DataTypes.STRING,
            allowNull: false
        },

        isAdmin:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        underscored: true // will add underscore in field name of database column instead of storing camel case notation
    });

    return User;
}