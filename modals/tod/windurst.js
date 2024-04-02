const { TODs, fetchUser } = require('../../db');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const chrono = require('chrono-node');
const moment = require('moment-timezone');

function pad(number) {
    return String(number).padStart(2, '0');
}

async function buildTZButton(discordUser) {
    const tz = new ButtonBuilder()
        .setCustomId('tz')
        .setLabel('Set Your Timezone')
        .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder()
        .addComponents([tz]);
}

async function calculateTimestamp(interaction) {
    const input = interaction.fields.getTextInputValue('todInput');
    const localUser = await fetchUser(interaction.user.id);

    if (input) {
        if (input.includes(':')) {
            if (localUser && localUser.timezone) {
                const parsed = chrono.parse(input);
                const formatted = parsed[0].start.get('year') + '-' + pad(parsed[0].start.get('month')) + '-' + pad(parsed[0].start.get('day')) + 'T' + pad(parsed[0].start.get('hour')) + ':' + pad(parsed[0].start.get('minute')) + ':' + pad(parsed[0].start.get('second'));
                return moment.tz(formatted, localUser.timezone);
            }
            else {
                const tzMenu = await buildTZButton(interaction.user);
                return interaction.reply({ content: 'You need to set your timezone before you can tag a specific time.', components: [tzMenu], ephemeral: true });
            }
        }
        else {
            return chrono.parseDate(input);
        }
    }

    return new Date();
}

module.exports = {
    data: { name: 'windurst' },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        let timestamp;

        timestamp = await calculateTimestamp(interaction);

        const tod = await TODs.create({
            name: 'Windurst',
            time: timestamp,
            user: interaction.user.username,
        });

        timestamp = Math.floor(tod.time.getTime() / 1000);

        const todEmbed = new EmbedBuilder()
            .setTitle('TOD Recorded')
            .addFields(
                { name: 'Airship', value: tod.name, inline: true },
                { name: 'Time', value: `<t:${timestamp}:R>`, inline: true },
            )
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        await interaction.channel.send({ embeds: [todEmbed] });
        await interaction.deleteReply();
    },
};
