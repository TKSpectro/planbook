'use strict';
module.exports = (sequelize, DataTypes) => {
    const Entry = sequelize.define(
        'Entry',
        {
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            income: {
                type: DataTypes.BOOLEAN,
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
                type: DataTypes.ENUM(
                    'daily',
                    'weekly',
                    'monthly',
                    'quarterly',
                    'yearly'
                ),
                allowNull: true,
                comment:
                    'time of the recurring interval, if null then its not recurring',
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
        Entry.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'categoryId',
        });
    };

    return Entry;
};
