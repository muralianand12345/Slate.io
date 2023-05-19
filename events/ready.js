const {
    Events
} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    execute(client) {
        console.log(`${client.user.tag} Ready!`)
    }
}
