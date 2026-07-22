const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const formulario = require("../handlers/formulario");
const db = require("../database/database");
const config = require("../config");

module.exports = {

name: Events.MessageCreate,

async execute(message) {

if (message.author.bot) return;
if (message.guild) return;

if (!formulario.existe(message.author.id)) return;

const datos = formulario.obtener(message.author.id);

datos.respuestas.push(message.content);

datos.paso++;

if (datos.paso >= formulario.total()) {

db.prepare(`
INSERT INTO postulaciones
(usuario,discord,estado,fecha,datos)
VALUES(?,?,?,?,?)
`).run(
message.author.id,
message.author.tag,
"Pendiente",
new Date().toLocaleString(),
JSON.stringify(datos.respuestas)
);

const guild = message.client.guilds.cache.get(config.guildId);

const canal = guild.channels.cache.get(config.channels.revision);

const embed = new EmbedBuilder()

.setColor("Blue")

.setTitle("📋 Nueva Postulación")

.setDescription(

datos.respuestas
.map((r,i)=>`**${i+1}.** ${r}`)
.join("\n\n")

)

.setFooter({

text: message.author.tag

})

.setTimestamp();

const botones = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(`aceptar_${message.author.id}`)

.setLabel("Aceptar")

.setStyle(ButtonStyle.Success),

new ButtonBuilder()

.setCustomId(`rechazar_${message.author.id}`)

.setLabel("Rechazar")

.setStyle(ButtonStyle.Danger)

);

await canal.send({

content:`<@&${config.roles.revisor}>`,

embeds:[embed],

components:[botones]

});

await message.channel.send("✅ Tu formulario fue enviado correctamente.");

formulario.eliminar(message.author.id);

return;

}

await message.channel.send(

formulario.pregunta(datos.paso)

);

}

};
