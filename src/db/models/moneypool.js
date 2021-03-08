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
            currentNeededMoney: {
                type: DataTypes.DOUBLE,
                allowNull: false,
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
            foreignKey: 'id',
        });
        Moneypool.hasMany(models.Payment, {
            as: 'payments',
            foreignKey: 'id',
        });
    };
    return Moneypool;
};
