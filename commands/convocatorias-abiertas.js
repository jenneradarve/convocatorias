const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("convocatorias-abiertas")

        .setDescription("Abre las convocatorias de ICE.")

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        const canal = interaction.guild.channels.cache.get("1527883021212979293");

        if (!canal) {

            return interaction.reply({

                content: "❌ No encontré el canal configurado.",

                ephemeral: true

            });

        }

        const embed = new EmbedBuilder()

            .setColor("#0A5FFF")

            .setTitle("🇺🇸 ICE MANAGEMENT")

            .setDescription(
`# Convocatorias Abiertas

Las convocatorias para formar parte de **U.S. Immigration and Customs Enforcement** ya se encuentran abiertas.

Antes de postularte asegúrate de cumplir con los requisitos establecidos por la institución.

Pulsa el botón **Postularse** para comenzar el proceso de selección.

> Solo los usuarios con el rol de Aspirante pueden enviar el formulario.`
)

            .setFooter({

                text: "ICE Management"

            })

            .setTimestamp();

        const boton = new ButtonBuilder()

            .setCustomId("postularse")

            .setLabel("Postularse")

            .setEmoji("📋")

            .setStyle(ButtonStyle.Primary);

        const fila = new ActionRowBuilder()

            .addComponents(boton);

        await canal.send({

            content: "<@&1527771385236291815>",

            embeds: [embed],

            components: [fila]

        });

        await interaction.reply({

            content: "✅ Convocatorias abiertas correctamente.",

            ephemeral: true

        });

    }

};
