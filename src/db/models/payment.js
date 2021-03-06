'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
        'Payment',
        {
            value: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            purpose: {
                type: DataTypes.STRING(320),
                allowNull: true,
            },
        },
        {
            tableName: 'payment',
        }
    );
    Payment.associate = function (models) {
        Payment.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
        Payment.belongsTo(models.Category, {
            as: 'category',
            foreignKey: 'categoryId',
        });
        Payment.belongsTo(models.RecurringPayment, {
            as: 'recurringPayment',
            foreignKey: 'recurringPaymentId',
        });
        Payment.belongsTo(models.Moneypool, {
            as: 'moneypool',
            foreignKey: 'moneypoolId',
        });
        Payment.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });
    };

    return Payment;
};
