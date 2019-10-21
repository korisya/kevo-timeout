const Discord = require('discord.js');
const config = require('config');

const adminIDs = config.get(`adminIDs`);
const KEVO_ID = config.get(`kevoID`);
const GUILD_ID = config.get(`guildID`);
const ROLE_ID = config.get('roleID');
let timeout = false;

const REFRESH_INTERVAL = config.get(`refreshIntervalMs`);

// Initialize Discord Bot
var client = new Discord.Client();

client.on('ready', () => {
  console.log('Connected');
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(client.user.username + ' - (' + client.user.id + ')');
});

client.on('error', console.error);

client.on('message', message => {
  if (message.content.substring(0, 1) == '!') {
    const args = message.content.split(' ');
    const cmd = args[0].substring(1);
    console.info('Command ' + cmd + ' received from ' + message.author.tag);

    const isAdmin = adminIDs.includes(message.author.id);

    if (isAdmin && cmd === 'timeout') {
      timeout = !timeout;
      console.info('TImeout is ' + timeout);
    }
  }
});


function kevoCheck() {
  console.log(`Checking kevo... timeout is ${timeout}`)
  const guild = client.guilds.get(GUILD_ID);
  if (guild) {
    const kevo = guild.member(KEVO_ID);
    if (kevo) {
      if (timeout && !kevo.roles.has(ROLE_ID)) {
        kevo.addRole(ROLE_ID)
          .then(console.log)
          .catch(console.error);
      } else if (!timeout && kevo.roles.has(ROLE_ID)) {
        kevo.removeRole(ROLE_ID)
          .then(console.log)
          .catch(console.error);
      }
    }
  }
  setTimeout(kevoCheck, REFRESH_INTERVAL);
}

const DISCORD_BOT_TOKEN = config.get('discordBotToken');
if (!DISCORD_BOT_TOKEN) {
  console.error('Missing discordBotToken config key.');
  process.exit();
}
client.login(DISCORD_BOT_TOKEN)
  .then(kevoCheck);
