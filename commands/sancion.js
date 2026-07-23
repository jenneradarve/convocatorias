const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("sancion")

        .setDescription("Sancionar a un funcionario de ICE")

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

        .addUserOption(option =>
            option
                .setName("funcionario")
                .setDescription("Funcionario sancionado")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("tipo")
                .setDescription("Tipo de sanción")
                .setRequired(true)
                .addChoices(
                    { name: "Warn", value: "warn" },
                    { name: "Advertencia", value: "advertencia" },
                    { name: "Suspensión", value: "suspension" },
                    { name: "Despido", value: "despido" }
                )
        )

        .addStringOption(option =>
            option
                .setName("motivo")
                .setDescription("Motivo de la sanción (mínimo 20 palabras)")
                .setRequired(true)
        )

        .addAttachmentOption(option =>
            option
                .setName("evidencia1")
                .setDescription("Evidencia obligatoria")
                .setRequired(true)
        )

        .addAttachmentOption(option =>
            option
                .setName("evidencia2")
                .setDescription("Evidencia obligatoria")
                .setRequired(true)
        )

        .addAttachmentOption(option =>
            option
                .setName("evidencia3")
                .setDescription("Evidencia opcional")
        )

        .addAttachmentOption(option =>
            option
                .setName("evidencia4")
                .setDescription("Evidencia opcional")
        )

        .addAttachmentOption(option =>
            option
                .setName("evidencia5")
                .setDescription("Evidencia opcional")
        ),

    async execute(interaction) {

        await interaction.reply({

            content: "🚧 Sistema de sanciones en construcción.",

            ephemeral: true

        });

    }

};
