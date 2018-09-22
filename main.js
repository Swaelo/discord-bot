const Commando = require('discord.js-commando');
var config = require('./package.json');
const bot = new Commando.Client();

//Add groups of commands for added bot functionality
bot.registry.registerGroup('jukebox', 'Jukebox');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

//Globals
global.servers = {};

//when the bot connects to the server
bot.on('ready', function()
{
    console.log("connected");
});

//whenever a message is sent
bot.on('message', function(message)
{
    if(message.content == 'Hello')
    {
        //message.reply('Hello!');
        message.channel.send("Hello!" + message.author + ", how are you?");
    }
});

bot.login(config.token);
