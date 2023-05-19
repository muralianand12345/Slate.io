const fs = require('fs');
const Discord = require('discord.js');
const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const Mcommands = new Collection();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

require("dotenv").config();
const Token = process.env.TOKEN;

const config = require('./config.json');
client.discord = Discord;
client.config = config;

var exec = require("child_process").exec;
var child = exec(`python api.py`);
child.stdout.on('data', async function (data) {
    console.log(data)
});

const events = fs.readdirSync('./events').filter(async (file) => file.endsWith('.js'));
for (let file of events) {
    const event = require(`./events/${file}`);
    console.log(`${event.name} Loaded!`)
    client.on(event.name, (...args) => event.execute(...args, client));
}

const Messagecommands = fs.readdirSync('./commands').filter(async (file) => file.endsWith('.js'));
for (let file of Messagecommands) {
    const command = require(`./commands/${file}`);
    Mcommands.set(command.name, command);
}
client.Mcommands = Mcommands;
module.exports = client;

client.login(Token).catch(err => {
    console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
    console.error(err);
    return process.exit();
});