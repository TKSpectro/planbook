const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

module.exports = function () {
    let sequelize;

    let options = {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    };

    if (process.env.DATABASE_LOGGING == 'true') {
        options['logging'] = console.log;
    } else {
        options['logging'] = false;
    }

    if (process.env.DATABASE_QUERY_PARAMETERS_LOGGING == 'true') {
        options['logQueryParameters'] = true;
    }

    sequelize = new Sequelize(
        process.env.DB_NAME || 'planbook',
        process.env.DB_USER || 'root',
        process.env.DB_PASSWORD || '',
        options
    );

    const db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
    };

    let modelsPath = path.join(__dirname, '..', 'src', 'db', 'models');
    let files = fs.readdirSync(modelsPath);

    files = files.filter((file) => {
        return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
    });

    files.forEach((file) => {
        const model = require(path.join(modelsPath, file))(
            sequelize,
            Sequelize
        );

        db[model.name] = model;
    });

    Object.keys(db).forEach((modelName) => {
        try {
            let fixedModelName =
                modelName.charAt(0).toLowerCase() + modelName.slice(1);
            let filePath = path.join(
                __dirname,
                '..',
                'models',
                fixedModelName + '.js'
            );
            if (fs.existsSync(filePath)) {
                require(filePath)(db[modelName], db);
            }
        } catch (err) {
            console.log(err);
        }

        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    return db;
};
