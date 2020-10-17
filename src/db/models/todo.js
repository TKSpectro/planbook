'use strict';
module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define(
        'Todo',
        {
            task: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            value: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            done: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            tableName: 'todo',
        }
    );
    Todo.associate = function (models) {
        Todo.belongsTo(models.Household, {
            as: 'household',
            foreignKey: 'householdId',
        });
    };
    return Todo;
};
