'use strict';
module.exports = (sequelize, DataTypes) => {
    const Household = sequelize.define(
        'Household',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'household',
        }
    );
    Household.associate = function (models) {
        Household.hasMany(models.Entry, {
            as: 'entries',
            foreignKey: 'entryId',
        });
    };
    return Household;
};
