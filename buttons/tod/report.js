const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: { name: 'report' },
    async execute(interaction) {
        const bastok = new ButtonBuilder()
            .setCustomId('bastok')
            .setLabel('Bastok')
            .setStyle(ButtonStyle.Success);

        const kazham = new ButtonBuilder()
            .setCustomId('kazham')
            .setLabel('Kazham')
            .setStyle(ButtonStyle.Success);

        const sandoria = new ButtonBuilder()
            .setCustomId('sandoria')
            .setLabel('San d\'Oria')
            .setStyle(ButtonStyle.Success);

        const windurst = new ButtonBuilder()
            .setCustomId('windurst')
            .setLabel('Windurst')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents([bastok, kazham, sandoria, windurst]);

        await interaction.reply({
            components: [row],
            ephemeral: true,
        });
    },
};
