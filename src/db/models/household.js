'use strict';
module.exports = (sequelize, DataTypes) => {
    const Household = sequelize.define(
        'Household',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'household',
        }
    );
    Household.associate = function (models) {
        Household.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'ownerId',
        });
        Household.belongsToMany(models.User, {
            as: 'members',
            through: 'householdUser',
        });
        Household.hasMany(models.RecurringPayment, {
            as: 'entries',
            foreignKey: 'householdId',
        });
        Household.hasMany(models.Invite, {
            as: 'invites',
            foreignKey: 'householdId',
        });
    };
    return Household;
};
