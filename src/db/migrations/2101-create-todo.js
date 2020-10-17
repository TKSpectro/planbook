'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('todo', {
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
                allowNull: false,
            },
            task: {
                type: Sequelize.STRING(320),
                allowNull: false,
            },
            value: {
                type: Sequelize.DOUBLE,
                allowNull: true,
            },
            done: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('todo');
    },
};
