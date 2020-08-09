'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('invite', {
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
            email: {
                type: Sequelize.STRING(320),
                allowNull: false,
                isEmail: true,
                unique: 'uniqueInviteEmail',
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
        return queryInterface.dropTable('invite');
    },
};
