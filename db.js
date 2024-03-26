const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const TODs = sequelize.define('tods', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    time: {
        type: DataTypes.DATE,
    },
    user: {
        type: DataTypes.STRING,
    },
});

async function getAllTODs() {
    return sequelize.query(`
    SELECT 
      t.name,
      t.time,
      t.id AS highest_id
    FROM
      (SELECT name, MAX(id) AS maxId FROM tods GROUP BY name) AS maxRecords
    INNER JOIN tods t ON t.id = maxRecords.maxId
  `, { model: TODs, mapToModel: true });
}

module.exports = {
    TODs,
    getAllTODs,
};
