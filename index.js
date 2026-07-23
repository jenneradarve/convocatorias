require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel
    ]
});

client.commands = new Collection();

// =========================
// CARGAR COMANDOS
// =========================

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(commandsPath, file));

        client.commands.set(command.data.name, command);

    }

}

// =========================
// CARGAR EVENTOS
// =========================

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(path.join(eventsPath, file));

        if (event.once) {

            client.once(event.name, (...args) => event.execute(...args, client));

        } else {

            client.on(event.name, (...args) => event.execute(...args, client));

        }

    }

}

client.once("ready", () => {

    console.log(`✅ ${client.user.tag} conectado correctamente.`);

});

client.login(process.env.TOKEN);
