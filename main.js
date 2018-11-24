//Load the bot class
var BotClass = require(__dirname + '/bot.js');
global.bot = new BotClass.Bot();

//set up the modular command handler
var BotCommandHandler = require(__dirname + '/commandHandler.js');
global.CommandHandler = new BotCommandHandler.CommandHandler();

//Add the desired command modules
var GeneralCommands = require(__dirname + '/general_commands/generalCommandGroup.js');
global.CommandHandler.RegisterGroup(new GeneralCommands.GeneralCommandGroup());

var RunescapeCommands = require(__dirname + '/runescape_commands/runescapeCommandGroup.js');
global.CommandHandler.RegisterGroup(new RunescapeCommands.RunescapeCommandGroup());

//everything is setup, now start the bot
global.bot.Login();
