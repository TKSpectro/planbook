'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('payment', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            value: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            purpose: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'category',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            householdId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'household',
                    },
                    key: 'id',
                },
                allowNull: false,
            },
            recurringPaymentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'recurringPayment',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            moneypoolId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'moneypool',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'user',
                    },
                    key: 'id',
                },
                allowNull: true,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('payment');
    },
};
