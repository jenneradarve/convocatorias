const {
Events
} = require("discord.js");

const formulario = require("../handlers/formulario");

module.exports = {

name: Events.InteractionCreate,

async execute(interaction, client) {

if (interaction.isChatInputCommand()) {

const command = client.commands.get(interaction.commandName);

if (!command) return;

return command.execute(interaction);

}

if (!interaction.isButton()) return;

if (interaction.customId !== "postularse") return;

const ROL = "1527771385236291815";

if (!interaction.member.roles.cache.has(ROL)) {

return interaction.reply({

content: "❌ No tienes permiso para postularte.",

ephemeral: true

});

}

if (formulario.existe(interaction.user.id)) {

return interaction.reply({

content: "❌ Ya tienes una postulación en proceso.",

ephemeral: true

});

}

formulario.crear(interaction.user.id);

await interaction.reply({

content: "📩 Revisa tus mensajes privados.",

ephemeral: true

});

const dm = await interaction.user.createDM();

await dm.send(formulario.pregunta(0));

}

};
