'use strict';
module.exports = (sequelize, DataTypes) => {
    const Moneypool = sequelize.define(
        'Moneypool',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            totalNeededMoney: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            householdId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'moneypool',
        }
    );
    Moneypool.associate = function (models) {
        Moneypool.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
        Moneypool.hasMany(models.Payment, {
            as: 'payments',
            foreignKey: 'moneypoolId',
        });
    };
    return Moneypool;
};
