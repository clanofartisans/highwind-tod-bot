const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const moment = require('moment-timezone');

function createTimezoneOptions() {
    const usTimezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Phoenix',
        'America/Los_Angeles',
        'America/Anchorage',
        'Pacific/Honolulu',
    ];

    const additionalTimezones = [
        'America/Caracas',
        'America/Buenos_Aires',
        'Atlantic/Cape_Verde',
        'Europe/London',
        'Europe/Paris',
        'Europe/Kaliningrad',
        'Europe/Moscow',
        'Asia/Dubai',
        'Asia/Karachi',
        'Asia/Dhaka',
        'Asia/Bangkok',
        'Asia/Singapore',
        'Asia/Tokyo',
        'Australia/Sydney',
        'Pacific/Guadalcanal',
        'Pacific/Auckland',
        'Pacific/Tongatapu',
    ];

    const combinedTimezones = Array.from(new Set([...usTimezones, ...additionalTimezones]));

    const options = combinedTimezones.map((tz) => {
        const offset = moment.tz(tz).format('Z');
        const label = tz.replace(/_/g, ' ');

        return new StringSelectMenuOptionBuilder()
            .setLabel(`${label} (UTC${offset})`)
            .setValue(tz);
    });

    return options;
}

module.exports = {
    data: { name: 'tz' },
    async execute(interaction) {
        const options = createTimezoneOptions();
        const tzSelect = new StringSelectMenuBuilder()
            .setCustomId('tz')
            .setPlaceholder('Select your timezone')
            .addOptions(options);

        const row = new ActionRowBuilder()
            .addComponents(tzSelect);

        await interaction.reply({
            components: [row],
            ephemeral: true,
        });
    },
};
