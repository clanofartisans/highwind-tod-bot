const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: { name: 'about' },
    async execute(interaction) {
        const aboutEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Highwind ToD Bot')
            .setDescription('Describe the bot here with url and stuff\n**GitHub**: <https://tod.hugin.gg>')
            .setThumbnail('https://cdn.discordapp.com/avatars/1220043312623386635/c021faf5d965d9361c7a5e17348d4c68.webp')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Get ToD Info', value: '`/tod`' },
                { name: 'Report ToD Info "Now"', value: '`/tod airship:Kazham`' },
                { name: 'Report ToD Info', value: '`/tod airship:Kazham time:5 minutes ago`' },
                { name: 'Bot Server Settings', value: '`/config`' },
            )
            .setFooter({ text: 'Created by Hugin', iconURL: 'https://cdn.discordapp.com/avatars/190648227404578816/82d08bf0a053d49db78e1a4062d12b19.webp' });

        await interaction.reply({ embeds: [aboutEmbed], ephemeral: true });
    },
};
