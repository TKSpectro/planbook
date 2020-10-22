'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invite = sequelize.define(
        'Invite',
        {
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
