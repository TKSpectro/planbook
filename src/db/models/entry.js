'use strict';
module.exports = (sequelize, DataTypes) => {
    const Entry = sequelize.define(
        'Entry',
        {
            income: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            timeStamp: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            value: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            purpose: {
                type: DataTypes.STRING(320),
                allowNull: false,
            },
            interval: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment:
                    'time of the interval in seconds, if null then its not recurring',
            },
        },
        {
            tableName: 'entry',
        }
    );
    Entry.associate = function (models) {
        Entry.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
        Entry.hasOne(models.Category, {
            as: 'category',
            foreignKey: 'categoryId',
        });
    };

    return Entry;
};
