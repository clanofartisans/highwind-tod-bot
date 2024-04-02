const { fetchUser, Users } = require('../../db');

module.exports = {
    data: { name: 'tz' },
    async execute(interaction) {
        let localUser = await fetchUser(interaction.user.id);

        if (!localUser) {
            localUser = await Users.create({
                discord_id: interaction.user.id,
            });
        }

        localUser.discord_nick = interaction.user.username;
        localUser.timezone = interaction.values[0];
        localUser.save();

        interaction.reply({ content: 'Your timezone selection has been saved!', ephemeral: true });
    },
};
