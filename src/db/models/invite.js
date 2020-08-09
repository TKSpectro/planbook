'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invite = sequelize.define(
        'Invite',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'invite',
        }
    );
    Invite.associate = function (models) {
        Invite.hasOne(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
    };
    return Invite;
};
