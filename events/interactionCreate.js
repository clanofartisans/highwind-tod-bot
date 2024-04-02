const path = require('node:path');
const fs = require('node:fs');

const { Events, Collection } = require('discord.js');

// Configure Buttons

let buttons = new Collection();

const buttonFoldersPath = path.join(__dirname, '../buttons');
const buttonFolders = fs.readdirSync(buttonFoldersPath);

for (const folder of buttonFolders) {
    const buttonsPath = path.join(buttonFoldersPath, folder);
    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
    for (const file of buttonFiles) {
        const filePath = path.join(buttonsPath, file);
        const button = require(filePath);

        if ('data' in button && 'execute' in button) {
            buttons[button.data.name] = button;
        }
        else {
            console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Configure Modals

let modals = new Collection();

const modalFoldersPath = path.join(__dirname, '../modals');
const modalFolders = fs.readdirSync(modalFoldersPath);

for (const folder of modalFolders) {
    const modalsPath = path.join(modalFoldersPath, folder);
    const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));
    for (const file of modalFiles) {
        const filePath = path.join(modalsPath, file);
        const modal = require(filePath);

        if ('data' in modal && 'execute' in modal) {
            modals[modal.data.name] = modal;
        }
        else {
            console.log(`[WARNING] The modal at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Configure Select Menus

let selects = new Collection();

const selectFoldersPath = path.join(__dirname, '../selects');
const selectFolders = fs.readdirSync(selectFoldersPath);

for (const folder of selectFolders) {
    const selectsPath = path.join(selectFoldersPath, folder);
    const selectFiles = fs.readdirSync(selectsPath).filter(file => file.endsWith('.js'));
    for (const file of selectFiles) {
        const filePath = path.join(selectsPath, file);
        const select = require(filePath);

        if ('data' in select && 'execute' in select) {
            selects[select.data.name] = select;
        }
        else {
            console.log(`[WARNING] The select menu at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Handle Interactions

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
            // Buttons
        }
        else if (interaction.isButton()) {
            try {
                buttons[interaction.customId].execute(interaction);
            }
            catch (error) {
                console.error(`Error executing button ${interaction.customId}`);
                console.error(error);
            }
            // Modal Submit
        }
        else if (interaction.isModalSubmit()) {
            try {
                modals[interaction.customId].execute(interaction);
            }
            catch (error) {
                console.error(`Error processing modal ${interaction.customId}`);
                console.error(error);
            }
            // Select Menu Submit
        }
        else if (interaction.isStringSelectMenu()) {
            try {
                selects[interaction.customId].execute(interaction);
            }
            catch (error) {
                console.error(`Error processing select menu ${interaction.customId}`);
                console.error(error);
            }
        }
    },
};
