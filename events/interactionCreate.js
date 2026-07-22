const {
    Events
} = require("discord.js");

const postulaciones = new Map();

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // ==========================
        // COMANDOS SLASH
        // ==========================

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (err) {

                console.error(err);

            }

            return;

        }

        // ==========================
        // BOTÓN POSTULARSE
        // ==========================

        if (interaction.isButton()) {

            if (interaction.customId !== "postularse") return;

            const ROL_POSTULANTE = "1527771385236291815";

            if (!interaction.member.roles.cache.has(ROL_POSTULANTE)) {

                return interaction.reply({

                    content: "❌ No tienes el rol requerido para postularte.",

                    ephemeral: true

                });

            }

            if (postulaciones.has(interaction.user.id)) {

                return interaction.reply({

                    content: "❌ Ya tienes una postulación en proceso.",

                    ephemeral: true

                });

            }

            postulaciones.set(interaction.user.id, {

                paso: 0,

                respuestas: {}

            });

            await interaction.reply({

                content: "📩 Revisa tus mensajes privados. Allí comenzaremos tu postulación.",

                ephemeral: true

            });

            const dm = await interaction.user.createDM();

            await dm.send(
`# 🇺🇸 ICE MANAGEMENT

Bienvenido al proceso de selección.

Responderás una serie de preguntas.

Escribe cada respuesta en un solo mensaje.

## Sección Información

**1. ¿Cuál es tu usuario de Discord?**`
);

        }

    }

};
