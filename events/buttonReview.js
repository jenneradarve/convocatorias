const {
Events,
ModalBuilder,
TextInputBuilder,
TextInputStyle,
ActionRowBuilder
} = require("discord.js");

const config = require("../config");

module.exports = {

name: Events.InteractionCreate,

async execute(interaction){

if(interaction.isButton()){

// ===================
// ACEPTAR
// ===================

if(interaction.customId.startsWith("aceptar_")){

const id = interaction.customId.split("_")[1];

const miembro = await interaction.guild.members.fetch(id);

await miembro.roles.remove([
config.roles.postulante,
config.roles.civil
]);

await miembro.roles.add([
config.roles.agente,
config.roles.verificado
]);

await miembro.send("🎉 Tu postulación fue **ACEPTADA**. Bienvenido a ICE.");

return interaction.update({

content:`✅ ${miembro} fue aceptado.`,

components:[],

embeds:interaction.message.embeds

});

}

// ===================
// RECHAZAR
// ===================

if(interaction.customId.startsWith("rechazar_")){

const modal = new ModalBuilder()

.setCustomId(interaction.customId)

.setTitle("Motivo del rechazo");

const motivo = new TextInputBuilder()

.setCustomId("motivo")

.setLabel("Motivo (mínimo 10 palabras)")

.setStyle(TextInputStyle.Paragraph)

.setRequired(true);

modal.addComponents(

new ActionRowBuilder().addComponents(motivo)

);

return interaction.showModal(modal);

}

}

// ===================
// MODAL
// ===================

if(interaction.isModalSubmit()){

if(!interaction.customId.startsWith("rechazar_")) return;

const motivo = interaction.fields.getTextInputValue("motivo");

if(motivo.trim().split(/\s+/).length < 10){

return interaction.reply({

content:"❌ El motivo debe tener mínimo 10 palabras.",

ephemeral:true

});

}

const id = interaction.customId.split("_")[1];

const miembro = await interaction.guild.members.fetch(id);

await miembro.send(
`❌ Tu postulación fue rechazada.

**Motivo:**

${motivo}`
);

await interaction.update({

content:`❌ ${miembro} fue rechazado.`,

components:[],

embeds:interaction.message.embeds

});

}

}

};
