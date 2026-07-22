const { Events } = require("discord.js");
const formulario = require("../handlers/formulario");
const estado = require("../database/estado");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // =====================
        // COMANDOS
        // =====================

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            return command.execute(interaction);

        }

        // =====================
        // BOTONES
        // =====================

        if (!interaction.isButton()) return;

        // ---------------------
        // POSTULARSE
        // ---------------------

        if (interaction.customId === "postularse") {

            if (!estado.estaAbierta()) {

                return interaction.reply({
                    content: "❌ Las convocatorias se encuentran cerradas.",
                    ephemeral: true
                });

            }

            const ROL = "1527771385236291815";

            if (!interaction.member.roles.cache.has(ROL)) {

                return interaction.reply({
                    content: "❌ No tienes el rol requerido para postularte.",
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

            return dm.send(formulario.pregunta(0));

        }

        // ---------------------
        // ACEPTAR
        // ---------------------

        if (interaction.customId.startsWith("aceptar_")) {

            return require("./buttonReview").execute(interaction);

        }

        // ---------------------
        // RECHAZAR
        // ---------------------

        if (interaction.customId.startsWith("rechazar_")) {

            return require("./buttonReview").execute(interaction);

        }

    }

};
