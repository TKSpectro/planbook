'use strict';
module.exports = (sequelize, DataTypes) => {
    const HouseholdUser = sequelize.define(
        'HouseholdUser',
        {
            timeJoined: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            householdId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'householdUser',
        }
    );
    HouseholdUser.associate = function (models) {
        HouseholdUser.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'id',
        });
        HouseholdUser.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'id',
        });
    };

    return HouseholdUser;
};
