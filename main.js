//Import discord command library
const Commando = require('discord.js-commando');
//Load config file containing login token etc
var config = require('./package.json');

//Initialise and setup the bot client
const bot = new Commando.Client();
//Add groups of commands for added functionality
bot.registry.registerGroup('jukebox', 'Jukebox');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");
//Maintain a list of servers in which we are connected to
//This is used to keep the different music queues of
//different servers seperated from one another
global.servers = {};

//Event Trigger: when connected to a new server
bot.on('ready', function()
{
    console.log("connected");
});

//Event Trigger: when a new message is sent to a server we are connected to
bot.on('message', function(message)
{
    if(message.content == 'Hello')
    {
        //message.reply('Hello!');
        message.channel.send("Hello!" + message.author + ", how are you?");
    }
});

//Setup complete, now connect the bot to any servers it has been invited to
bot.login(config.token);
