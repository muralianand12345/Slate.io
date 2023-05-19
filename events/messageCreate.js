const {
    Events,
    EmbedBuilder,
    Collection,
    PermissionsBitField
} = require('discord.js');
const cooldown = new Collection();
const ms = require('ms');

module.exports = {
    name: Events.MessageCreate,
    execute: async (message, client) => {

        const prefix = client.config.Prefix;

        if (message.author.bot) return;
        if (message.channel.type !== 0) return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if (cmd.length == 0) return;

        try {

            let command = client.Mcommands.get(cmd);
            if (command == null) return;
            if (!command) command = client.Mcommands.get(client.aliases.get(cmd));

            if (command) {
                if (command.cooldown) {
                    if (cooldown.has(`${command.name}${message.author.id}`)) {
                        var coolMsg = client.config.MESSAGE["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true }));
                        const coolEmbed = new EmbedBuilder()
                            .setDescription(`${coolMsg}`)
                            .setColor('#ED4245');
                        return message.channel.send({ embeds: [coolEmbed] }).then((msg) => {
                            setTimeout(function () {
                                msg.delete();
                            }, 4000);
                        });
                    }

                    if (command.userPerms || command.botPerms) {
                        if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('#ED4245');
                            return message.reply({ embeds: [userPerms] }).then((msg) => {
                                setTimeout(function () {
                                    msg.delete();
                                }, 4000);
                            });
                        }

                        if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('#ED4245');
                            return message.reply({ embeds: [botPerms] }).then((msg) => {
                                setTimeout(function () {
                                    msg.delete();
                                }, 4000);
                            });
                        }
                    }

                    command.run(client, message, args);
                    cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.author.id}`);
                    }, command.cooldown);

                } else {

                    if (command.userPerms || command.botPerms) {
                        if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('#ED4245');
                            return message.reply({ embeds: [userPerms] }).then((msg) => {
                                setTimeout(function () {
                                    msg.delete();
                                }, 4000);
                            });
                        }

                        if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('#ED4245');
                            return message.reply({ embeds: [botPerms] }).then((msg) => {
                                setTimeout(function () {
                                    msg.delete();
                                }, 4000);
                            });
                        }
                    }
                    command.run(client, message, args);
                }
            }


        } catch (error) {
            global.console.log(error);
            const botErrorEmbed = new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription('An Internal **Error** Occurred, Kindly Contact The Bot Developers!');
            return message.reply({
                embeds: [botErrorEmbed],
                ephemeral: true
            }).then((msg) => {
                setTimeout(function () {
                    msg.delete();
                }, 4000);
            });
        }
    }
}