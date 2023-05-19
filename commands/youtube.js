const fetch = require('node-fetch');
const axios = require('axios');
require("dotenv").config();
const Key = process.env.GOOGLE_KEY;

const {
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    name: 'youtube',
    description: "Get Rekt",
    cooldown: 1000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {

        var ytLink = args.join(" ");
        if (!ytLink) return message.reply({ content: 'No Youtube Link Provided! ' });

        const youtubeLinkRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/g;
        const youtubeLinks = ytLink.match(youtubeLinkRegex);
        if (!youtubeLinks) return message.reply({ content: 'No Valid Youtube Link Provided!' });

        if (youtubeLinks) {
            for (const link of youtubeLinks) {
                try {
                    const videoId = extractVideoId(link);
                    const apiUrl = `http://127.0.0.1:5001/api/subtitles/${videoId}`;
                    const data = await fetchJsonData(apiUrl)
                    const points = data.summary_points;

                    const embed = new EmbedBuilder().setColor('White');
                    for (const point of points) {
                        embed.addFields({ name: " ", value: `${point}` });
                    }

                    await message.channel.send({ embeds: [embed] }).then(async(msg)=>{
                        await message.delete()
                    });
                } catch (error) {
                    console.error(error)
                }
            }
        }

        function extractVideoId(link) {
            const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/;
            const match = link.match(youtubeRegex);
            if (match) {
                return match[1];
            } else {
                return null;
            }
        }

        function fetchJsonData(url) {
            return fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch data from the API');
                    }
                })
                .catch(error => {
                    console.error(error);
                    throw error;
                });
        }
    }
}