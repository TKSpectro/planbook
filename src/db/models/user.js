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
        },
        {
            tableName: 'user',
        }
    );
    Entry.associate = function (models) {
        Entry.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
    };
    return User;
};
