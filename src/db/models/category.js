'use strict';
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: 'uniqueCategory',
            },
        },
        {
            tableName: 'category',
        }
    );
    return Category;
};
