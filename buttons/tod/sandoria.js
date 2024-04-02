const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name: 'sandoria' },
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('sandoria')
            .setTitle('San d\'Oria Report');

        const todInput = new TextInputBuilder()
            .setCustomId('todInput')
            .setLabel('Time of Death')
            .setPlaceholder('Leave blank for "now"')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const actions = new ActionRowBuilder()
            .addComponents(todInput);

        modal.addComponents(actions);

        await interaction.showModal(modal);
    },
};
