'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(70),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(320),
                allowNull: false,
            },
            passwordHash: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'user',
        }
    );
    User.associate = function (models) {
        User.belongsToMany(models.Household, {
            through: 'household_user',
        });
    };
    return User;
};
