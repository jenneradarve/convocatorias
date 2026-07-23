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

        if (!formulario.validar(message.author.id, message.content)) {
            return message.channel.send(
                "❌ Tu respuesta no cumple el mínimo de palabras requerido. Inténtalo nuevamente."
            );
        }

        formulario.guardar(message.author.id, message.content);

        if (!formulario.terminado(message.author.id)) {

            return message.channel.send(
                formulario.pregunta(message.author.id)
            );

        }

        const respuestas = formulario.respuestas(message.author.id);

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

        const canal = guild.channels.cache.get(config.channels.revision);

        const embed = new EmbedBuilder()
            .setColor("#0066CC")
            .setTitle("📋 Nueva Postulación")
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({
                text: message.author.tag
            })
            .setTimestamp();

        formulario.preguntas.forEach((pregunta, index) => {

            embed.addFields({
                name: pregunta.titulo,
                value: respuestas[index] || "Sin respuesta"
            });

        });

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
            "✅ Tu postulación fue enviada correctamente. Ahora será revisada por el Departamento de Reclutamiento."
        );

        formulario.eliminar(message.author.id);

    }

};
