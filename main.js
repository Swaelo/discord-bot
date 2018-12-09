//Load the bot class
var BotClass = require(__dirname + '/bot.js');
global.bot = new BotClass.Bot();

//set up the modular command handler
var BotCommandHandler = require(__dirname + '/commandHandler.js');
global.CommandHandler = new BotCommandHandler.CommandHandler();

//Runescape commands, currently used for quickly looking up best ways to find any invention material
var RunescapeCommands = require(__dirname + '/runescape_commands/runescapeCommandGroup.js');
global.CommandHandler.RegisterGroup(new RunescapeCommands.RunescapeCommandGroup());

//everything is setup, now start the bot
global.bot.Login();
