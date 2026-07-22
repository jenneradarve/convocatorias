const {
SlashCommandBuilder,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
PermissionFlagsBits
} = require("discord.js");

const estado = require("../database/estado");

module.exports = {

data: new SlashCommandBuilder()

.setName("convocatorias-abiertas")

.setDescription("Abrir convocatorias.")

.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

async execute(interaction){

estado.abrir();

const canal = interaction.guild.channels.cache.get("1527883021212979293");

const embed = new EmbedBuilder()

.setColor("Blue")

.setTitle("🇺🇸 ICE MANAGEMENT")

.setDescription(`# Convocatorias Abiertas

Las convocatorias para **U.S. Immigration and Customs Enforcement** se encuentran abiertas.

Presiona **📋 Postularse** para iniciar tu proceso de selección.`)

.setTimestamp();

const fila = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("postularse")

.setLabel("Postularse")

.setEmoji("📋")

.setStyle(ButtonStyle.Primary)

);

await canal.bulkDelete(20,true).catch(()=>{});

await canal.send({

content:"<@&1527771385236291815>",

embeds:[embed],

components:[fila]

});

await interaction.reply({

content:"✅ Convocatorias abiertas.",

ephemeral:true

});

}

};
