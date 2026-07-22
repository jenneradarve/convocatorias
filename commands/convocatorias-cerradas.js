const {
SlashCommandBuilder,
PermissionFlagsBits
} = require("discord.js");

const estado = require("../database/estado");

module.exports={

data:new SlashCommandBuilder()

.setName("convocatorias-cerradas")

.setDescription("Cerrar convocatorias.")

.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

async execute(interaction){

estado.cerrar();

const canal=interaction.guild.channels.cache.get("1527883021212979293");

await canal.bulkDelete(20,true).catch(()=>{});

await canal.send({

content:"<@&1527771385236291815>\n\n❌ **Las convocatorias se encuentran cerradas.**"

});

await interaction.reply({

content:"✅ Convocatorias cerradas.",

ephemeral:true

});

}

};
