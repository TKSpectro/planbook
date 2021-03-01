'use strict';
module.exports = (sequelize, DataTypes) => {
    const RecurringPayment = sequelize.define(
        'RecurringPayment',
        {
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: true,
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
            tableName: 'recurringPayment',
        }
    );
    RecurringPayment.associate = function (models) {
        RecurringPayment.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
        RecurringPayment.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'categoryId',
        });
    };

    return RecurringPayment;
};
