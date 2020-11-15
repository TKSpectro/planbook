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
        Household.belongsTo(models.User, {
            as: 'owner',
            foreignKey: 'userId',
        });
        Household.belongsToMany(models.User, {
            through: 'household_user',
        });
        Household.hasMany(models.Entry, {
            as: 'entries',
            foreignKey: 'id',
        });
        Household.hasMany(models.Todo, {
            as: 'todos',
            foreignKey: 'id',
        });
    };
    return Household;
};
