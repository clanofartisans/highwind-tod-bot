const { Events, ActivityType } = require('discord.js');
const { TODs, Servers, Users } = require('../db');
const { presence } = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        TODs.sync();
        Servers.sync();
        Users.sync();

        client.user.setPresence({ activities: [{ name: 'HorizonXI', state: presence, type: ActivityType.Playing }], status: 'online' });

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
