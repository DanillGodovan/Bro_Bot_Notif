const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent] });
const config = require('./config.json');
const db = require('./database.js');
const nt = require('./notif.js')

let customMessage = "Век негр, а ещё новое видео!";

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await db.initialize();
  nt.active(client)
});

client.on(Discord.Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(`${config.prefix}custom`)) {
    if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const newMessage = message.content.replace(`${config.prefix}custom `, '');
      nt.change(newMessage)
      message.channel.send('Сообщение успешно изменено!');
    } else {
      message.channel.send('У вас нет прав на использование этой команды!');
    };
  }
  else if (message.content.startsWith(`${config.prefix}view`)) {
    if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const custom = nt.view()
      message.channel.send(`${custom}`);
    } else {
      message.channel.send('У вас нет прав на использование этой команды!');
    };
  }
  else if (message.content.startsWith(`${config.prefix}drop`)) {
    if (message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      message.channel.send(`База данных сброшена`);
      await db.reset();
      await db.initialize();
    } else {
      message.channel.send('У вас нет прав на использование этой команды!');
    };
  }
  else if (message.content.startsWith(`${config.prefix}notif_stop`)) {
    nt.stop();
    message.channel.send('Уведомления приостановлены!');
  }
  else if (message.content.startsWith(`${config.prefix}notif_start`)) {
    nt.active(client);
    message.channel.send('Уведомления возобновлены!');
  }
});

client.login(config.token);