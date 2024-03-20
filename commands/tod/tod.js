const chrono = require('chrono-node');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { TODs, getAllTODs } = require('../../db');

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
			const results = await getAllTODs();

			const todEmbed = new EmbedBuilder()
				.setTitle('Highwind TODs');

			results.forEach(entry => {
				const timestamp = Math.floor(new Date(entry.time).getTime() / 1000);

				todEmbed.addFields({ name: entry.name, value: `<t:${timestamp}:R>` });
			});

			await interaction.reply({ embeds: [todEmbed] });
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