'use strict';
module.exports = (sequelize, DataTypes) => {
    const Household_user = sequelize.define(
        'Household_user',
        {
            timeJoined: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'entry',
        }
    );
    Household_user.associate = function (models) {
        Household_user.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
        Household_user.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });
    };

    return Household_user;
};
