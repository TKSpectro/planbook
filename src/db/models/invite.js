'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invite = sequelize.define(
        'Invite',
        {
            validUntil: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            wasUsed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            invitedEmail: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'invite',
        }
    );
    Invite.associate = function (models) {
        Invite.belongsTo(models.User, {
            as: 'sender',
            foreignKey: 'senderId',
        });
    };
    return Invite;
};
