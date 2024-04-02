const chrono = require('chrono-node');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const { TODs, Users, fetchTODs, fetchUser } = require('../../db');

async function buildTODMenu(discordUser) {
    const localUser = await fetchUser(discordUser.id);

    const report = new ButtonBuilder()
        .setCustomId('report')
        .setLabel('Report a TOD')
        .setStyle(ButtonStyle.Success);

    const tz = new ButtonBuilder()
        .setCustomId('tz')
        .setLabel((localUser && localUser.timezone) ? 'Update Your Timezone' : 'Set Your Timezone')
        .setStyle((localUser && localUser.timezone) ? ButtonStyle.Secondary : ButtonStyle.Primary);

    const about = new ButtonBuilder()
        .setCustomId('about')
        .setLabel('About the Bot')
        .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder()
        .addComponents([report, tz, about]);
}

async function buildTODMessage() {
    const results = await fetchTODs();

    const groupedByAirship = results.reduce((acc, entry) => {
        const todTimestamp = Math.floor(new Date(entry.time).getTime() / 1000);
        const nextTimestamp = todTimestamp + (4 * 60 * 60);

        let entryString;

        if (nextTimestamp >= Math.floor(new Date().getTime() / 1000)) {
            entryString = `> **Last**: <t:${todTimestamp}:t> ~ **Next**: <t:${nextTimestamp}:R>`;
        }
        else {
            entryString = `> **Last**: <t:${todTimestamp}:t> ~ **Next**: ¯\\_(ツ)_/¯`;
        }

        if (!acc[entry.name]) {
            acc[entry.name] = [];
        }

        acc[entry.name].push(entryString);
        return acc;
    }, {});

    const messageParts = [];
    ['Bastok', 'Kazham', 'San d\'Oria', 'Windurst'].forEach((airship) => {
        if (groupedByAirship[airship]) {
            messageParts.push(`> ## ${airship}\n${groupedByAirship[airship].join('\n')}`);
        }
    });

    return messageParts.length > 0 ? messageParts.join('\n') : 'No TODs recorded yet.';
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tod')
        .setDescription('Adds or provides ToD info for Highwind')
        .addStringOption(option =>
            option.setName('airship')
                .setDescription('Which airship Highwind is/was on?')
                .addChoices(
                    { name: 'Bastok', value: 'Bastok' },
                    { name: 'Kazham', value: 'Kazham' },
                    { name: 'San d\'Oria', value: 'San d\'Oria' },
                    { name: 'Windurst', value: 'Windurst' },
                ))
        .addStringOption(option =>
            option.setName('when')
                .setDescription('When did Highwind die?')),
    async execute(interaction) {
        const name = interaction.options.getString('airship');
        const time = interaction.options.getString('when');

        if (!name && !time) {
            const todMessage = await buildTODMessage();
            const todMenu = await buildTODMenu(interaction.user);

            await interaction.reply({ content: todMessage, components: [todMenu] });
        }

        if (!name && time) {
            await interaction.reply({ content: 'You need to specify which airship Highwind is/was on.', ephemeral: true });
        }

        if (name && !time) {
            const tod = await TODs.create({
                name: name,
                time: new Date(),
                user: interaction.user.username,
            });

            const timestamp = Math.floor(tod.time.getTime() / 1000);

            const todEmbed = new EmbedBuilder()
                .setTitle('TOD Recorded')
                .addFields(
                    { name: 'Airship', value: tod.name, inline: true },
                    { name: 'Time', value: `<t:${timestamp}:R>`, inline: true },
                );

            return interaction.reply({ embeds: [todEmbed] });
        }

        if (name && time) {
            try {
                const tod = await TODs.create({
                    name: name,
                    time: chrono.parseDate(time),
                    user: interaction.user.username,
                });

                const timestamp = Math.floor(tod.time.getTime() / 1000);

                const todEmbed = new EmbedBuilder()
                    .setTitle('TOD Recorded')
                    .addFields(
                        { name: 'Airship', value: tod.name, inline: true },
                        { name: 'Time', value: `<t:${timestamp}:R>`, inline: true },
                    );

                return interaction.reply({ embeds: [todEmbed] });
            }
            catch (error) {
                return interaction.reply('Something went wrong with adding a TOD.');
            }
        }
    },
};
