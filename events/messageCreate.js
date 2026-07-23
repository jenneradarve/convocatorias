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

        // ==========================
        // VALIDAR RESPUESTA
        // ==========================

        if (!formulario.validar(message.author.id, message.content)) {

            return message.channel.send(
                "❌ Tu respuesta es demasiado corta. Amplíala antes de continuar con la siguiente pregunta."
            );

        }

        // ==========================
        // GUARDAR RESPUESTA
        // ==========================

        formulario.guardar(message.author.id, message.content);

        // ==========================
        // SI TERMINÓ EL FORMULARIO
        // ==========================

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

            if (!guild) {
                return message.channel.send("❌ Error: no se encontró el servidor.");
            }

            const canal = guild.channels.cache.get(config.channels.revision);

            if (!canal) {
                return message.channel.send("❌ Error: no se encontró el canal de revisión.");
            }

            const descripcion = respuestas
                .map((respuesta, indice) => {
                    return `### ${indice + 1}. ${respuesta}`;
                })
                .join("\n\n");

            const embed = new EmbedBuilder()
                .setColor("#0A5FFF")
                .setTitle("📋 Nueva Postulación")
                .setDescription(descripcion)
                .setFooter({
                    text: `${message.author.tag} • ${message.author.id}`
                })
                .setTimestamp();

            const botones = new ActionRowBuilder().addComponents(

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
                "✅ Tu formulario fue enviado correctamente.\n\nAhora será revisado por el Departamento de Reclutamiento."
            );

            formulario.eliminar(message.author.id);

            return;

        }

        // ==========================
        // SIGUIENTE PREGUNTA
        // ==========================

        await message.channel.send(
            formulario.pregunta(message.author.id)
        );

    }

};
