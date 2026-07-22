require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [

new SlashCommandBuilder()
.setName("convocatorias-abiertas")
.setDescription("Abrir convocatorias."),

new SlashCommandBuilder()
.setName("convocatorias-cerradas")
.setDescription("Cerrar convocatorias."),

new SlashCommandBuilder()
.setName("sancion")
.setDescription("Registrar una sanción.")
.addUserOption(option =>
option
.setName("funcionario")
.setDescription("Funcionario sancionado.")
.setRequired(true))

.addStringOption(option =>
option
.setName("tipo")
.setDescription("Tipo de sanción.")
.setRequired(true)
.addChoices(
{ name: "Warn", value: "warn" },
{ name: "Advertencia", value: "advertencia" },
{ name: "Suspensión", value: "suspension" },
{ name: "Despido", value: "despido" }
))

].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

try {

console.log("Registrando comandos...");

await rest.put(

Routes.applicationGuildCommands(
process.env.CLIENT_ID,
process.env.GUILD_ID
),

{ body: commands }

);

console.log("✅ Comandos registrados.");

} catch (error) {

console.error(error);

}

})();
