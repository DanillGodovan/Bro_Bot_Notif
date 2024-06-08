const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent] });
const config = require('./config.json');
const rssParser = require('rss-parser');
const parser = new rssParser();
const db = require('./database.js');

let intId;
let customMessage = "новое видео!"; 

module.exports = {
    active: (client, msg) => {
        if (!intId) {
            intId = setInterval(async () => {
                try {
                    const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${config.youtubeChannelID}`);
                    const latestVideo = feed.items[0];
                    const lastCheckedVideo = await db.getLastCheckedVideo();
              
                    if (!lastCheckedVideo || latestVideo.id !== lastCheckedVideo.id) {
                      const channel = client.channels.cache.get(config.notificationChannelID);
                      if (channel) {
                        const url = latestVideo.id.slice(9).trim()
                        channel.send(`${customMessage}\nhttps://youtu.be/${url}`);
                      } else {
                        console.error('Канал для отправки не не найден.')
                      }
                      await db.updateLastCheckedVideo(latestVideo.id, latestVideo.pubDate);
                    }
                  } catch (error) {
                    console.error('Произошла ошибка с получением последнего видео.', error);
                  } 
            }, config.checkInterval);
        }
    },
    stop: () => {
        clearInterval(intId);
        intId = null;
    },
    change: (arg) => {
        customMessage = arg;
    },
    view: () => {
        return customMessage;
    }
}

