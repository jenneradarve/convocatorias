const { Events } = require("discord.js");
const config = require("../config");

module.exports={

name:Events.InteractionCreate,

async execute(interaction){

if(!interaction.isButton()) return;

if(interaction.customId.startsWith("aceptar_")){

const id=interaction.customId.split("_")[1];

const miembro=await interaction.guild.members.fetch(id);

await miembro.roles.remove([
config.roles.postulante,
config.roles.civil
]);

await miembro.roles.add([
config.roles.agente,
config.roles.verificado
]);

await interaction.update({

content:`✅ ${miembro} fue aceptado.`,

components:[],

embeds:interaction.message.embeds

});

}

}

}
