const { Events } = require("discord.js");

const formulario = require("../handlers/formulario");

module.exports={

name:Events.MessageCreate,

async execute(message){

if(message.author.bot) return;

if(message.guild) return;

if(!formulario.existe(message.author.id)) return;

const datos=formulario.obtener(message.author.id);

datos.respuestas.push(message.content);

datos.paso++;

if(datos.paso>=formulario.total()){

await message.channel.send("✅ Tu formulario fue enviado correctamente.");

formulario.eliminar(message.author.id);

return;

}

await message.channel.send(formulario.pregunta(datos.paso));

}

}
