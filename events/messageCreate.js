const {
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const formulario = require("../handlers/formulario");
const config = require("../config");
const db = require("../database/database");

module.exports = {

    name: Events.MessageCreate,

    async execute(message) {

        if (message.author.bot) return;
        if (message.guild) return;

        if (!formulario.existe(message.author.id)) return;

        formulario.guardar(message.author.id, message.content);

        if (formulario.terminado(message.author.id)) {

            const respuestas = formulario.respuestas(message.author.id);

            db.prepare(`
                INSERT INTO postulaciones
                (usuario, discord, estado, fecha, datos)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                message.author.id,
                message.author.tag,
                "Pendiente",
                new Date().toLocaleString(),
                JSON.stringify(respuestas)
            );

            const guild = message.client.guilds.cache.get(config.guildId);

            const canal = guild.channels.cache.get(config.channels.revision);

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("📋 Nueva Postulación")
                .setDescription(
                    respuestas
                        .map((r, i) => `**${i + 1}.** ${r}`)
                        .join("\n\n")
                )
                .setFooter({
                    text: `${message.author.tag} • ${message.author.id}`
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
                content: `<@&${config.roles.revisor}>`,
                embeds: [embed],
                components: [botones]
            });

            await message.channel.send(
                "✅ Tu formulario fue enviado correctamente. Espera la revisión de un miembro del Staff."
            );

            formulario.eliminar(message.author.id);

            return;
        }

        await message.channel.send(
            formulario.pregunta(message.author.id)
        );

    }

};
