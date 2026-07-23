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
const detectarIA = require("../utils/aiDetector");

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
                "❌ Tu respuesta no cumple el mínimo de palabras requerido. Inténtalo nuevamente."
            );

        }

        // ==========================
        // GUARDAR RESPUESTA
        // ==========================

        formulario.guardar(message.author.id, message.content);

        // ==========================
        // SIGUIENTE PREGUNTA
        // ==========================

        if (!formulario.terminado(message.author.id)) {

            return message.channel.send(
                formulario.pregunta(message.author.id)
            );

        }

        // ==========================
        // RESPUESTAS
        // ==========================

        const respuestas = formulario.respuestas(message.author.id);

        // ==========================
        // GUARDAR SQLITE
        // ==========================

        db.prepare(`
            INSERT INTO postulaciones
            (usuario, discord, estado, fecha, datos)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            message.author.id,
            message.author.tag,
            "Pendiente",
            new Date().toISOString(),
            JSON.stringify(respuestas)
        );

        const guild = message.client.guilds.cache.get(config.guildId);

        if (!guild) {

            await message.channel.send("❌ No se encontró el servidor.");

            formulario.eliminar(message.author.id);

            return;

        }

        const canal = guild.channels.cache.get(config.channels.revision);

        if (!canal) {

            await message.channel.send("❌ No se encontró el canal de revisión.");

            formulario.eliminar(message.author.id);

            return;

        }

        // ==========================
        // EMBED
        // ==========================

        const embed = new EmbedBuilder()
            .setColor("#0055FF")
            .setTitle("📋 Nueva Postulación")
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({
                text: `${message.author.tag} • ${message.author.id}`
            })
            .setTimestamp();

        formulario.preguntas.forEach((pregunta, index) => {

            embed.addFields({

                name: pregunta.titulo,

                value: respuestas[index] || "Sin respuesta"

            });

        });

        // ==========================
        // DETECTOR IA
        // ==========================

        let iaDetectada = false;

        for (const respuesta of respuestas) {

            if (detectarIA(respuesta)) {

                iaDetectada = true;

                break;

            }

        }

        if (iaDetectada) {

            embed.addFields({

                name: "⚠️ Posible respuesta hecha con Inteligencia Artificial",

                value: "<@&1528606817528053840>"

            });

        }

        // ==========================
        // BOTONES
        // ==========================

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

        // ==========================
        // ENVIAR POSTULACIÓN
        // ==========================

        await canal.send({

            content: `<@&${config.roles.revisor}>`,

            embeds: [embed],

            components: [botones]

        });

        // ==========================
        // CONFIRMACIÓN
        // ==========================

        await message.channel.send(

            "✅ Tu formulario fue enviado correctamente.\n\nAhora será revisado por el Departamento de Reclutamiento."

        );

        formulario.eliminar(message.author.id);

    }

};
