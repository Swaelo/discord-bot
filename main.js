//Load any librarys and extra files we need access to
const Commando = require('discord.js-commando');
var config = require(__dirname + "/package.json");
var jukebox = require(__dirname + "/commands/jukebox/jukebox.js");

//Initialize the bot
const bot = new Commando.Client({
    commandPrefix: config.prefix
});

//Store some globals
global.jukebox = new jukebox.Jukebox();
global.bot = bot;

//Register groups and load in all the extra commands
bot.registry.registerGroup('jukebox', 'Jukebox');
bot.registry.registerGroup('general', 'General');
bot.registry.registerCommandsIn(__dirname + "/commands");

//Connect the bot to the server and signal our success
bot.login(config.token)
    .then(console.log('swaelo bot now running'))
    .catch(console.error);

//Event Trigger when the bot connects to a server
bot.on('ready', () =>
{
    bot.guilds.forEach((guild) =>
    {
        global.jukebox.AddServer(guild);
    });
});
