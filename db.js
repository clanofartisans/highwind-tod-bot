const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
    dialectOptions: {
        useUTC: true,
    },
    timezone: '+00:00',
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

const Servers = sequelize.define('servers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discord_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    readonly: {
        type: DataTypes.BOOLEAN,
    },
});

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    discord_id: {
        type: DataTypes.INTEGER,
    },
    discord_nick: {
        type: DataTypes.STRING,
    },
    timezone: {
        type: DataTypes.STRING,
    },
});

async function fetchTODs() {
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

async function fetchUser(discordId) {
    return Users.findOne({ where: { discord_id: discordId } });
}

module.exports = {
    TODs,
    Servers,
    Users,
    fetchTODs,
    fetchUser,
};
