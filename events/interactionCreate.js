const {
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const formulario = require("../handlers/formulario");
const estado = require("../database/estado");
const config = require("../config");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // ===========================
        // COMANDOS
        // ===========================

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            return command.execute(interaction);

        }

        // ===========================
        // BOTONES
        // ===========================

        if (interaction.isButton()) {

            // -----------------------
            // POSTULARSE
            // -----------------------

            if (interaction.customId === "postularse") {

                if (!estado.estaAbierta()) {

                    return interaction.reply({
                        content: "❌ Las convocatorias están cerradas.",
                        ephemeral: true
                    });

                }

                if (!interaction.member.roles.cache.has(config.roles.postulante)) {

                    return interaction.reply({
                        content: "❌ No tienes el rol requerido.",
                        ephemeral: true
                    });

                }

                if (formulario.existe(interaction.user.id)) {

                    return interaction.reply({
                        content: "❌ Ya tienes una postulación en curso.",
                        ephemeral: true
                    });

                }

                formulario.crear(interaction.user.id);

                await interaction.reply({
                    content: "📩 Revisa tus mensajes privados.",
                    ephemeral: true
                });

                const dm = await interaction.user.createDM();

                return dm.send(formulario.pregunta(interaction.user.id));

            }

            // -----------------------
            // ACEPTAR
            // -----------------------

            if (interaction.customId.startsWith("aceptar_")) {

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

                await miembro.send(
                    "🎉 Felicitaciones. Tu postulación fue **ACEPTADA**."
                );

                return interaction.update({
                    content: `✅ ${miembro} fue aceptado correctamente.`,
                    embeds: interaction.message.embeds,
                    components: []
                });

            }

            // -----------------------
            // RECHAZAR
            // -----------------------

            if (interaction.customId.startsWith("rechazar_")) {

                const modal = new ModalBuilder()
                    .setCustomId(interaction.customId)
                    .setTitle("Motivo del rechazo");

                const motivo = new TextInputBuilder()
                    .setCustomId("motivo")
                    .setLabel("Mínimo 10 palabras")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(motivo)
                );

                return interaction.showModal(modal);

            }

        }

        // ===========================
        // MODAL
        // ===========================

        if (interaction.isModalSubmit()) {

            if (!interaction.customId.startsWith("rechazar_")) return;

            const motivo = interaction.fields.getTextInputValue("motivo");

            if (motivo.trim().split(/\s+/).length < 10) {

                return interaction.reply({
                    content: "❌ Debes escribir al menos 10 palabras.",
                    ephemeral: true
                });

            }

            const id = interaction.customId.split("_")[1];

            const miembro = await interaction.guild.members.fetch(id);

            await miembro.send(
`❌ Tu postulación fue rechazada.

**Motivo:**

${motivo}`
            );

            return interaction.update({

                content: `❌ ${miembro} fue rechazado.`,

                embeds: interaction.message.embeds,

                components: []

            });

        }

    }

};
