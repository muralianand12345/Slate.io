module.exports = {
    name: 'ping',
    description: "Ping Command",
    cooldown: 10000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {

        await message.reply({ content: 'Pinging ...'}).then(async(msg)=>{
            let ping = Math.round(client.ws.ping);
            await msg.edit({ content: `Ping: ${ping} ms` });
        });
    }
}