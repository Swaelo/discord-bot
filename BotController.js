var SwaeloBot = require(__dirname + '/SwaeloBot.js');  //Swaelo Bot class for Discord Fun
var CommandGroup = require(__dirname + '/CommandGroup.js');  //Commands for the Bot are organized into groups
var CommandHandler = require(__dirname + '/CommandHandler.js');  //Groups are managed by the command handler, all input is sent to the handler, it does magic and gets it where it belongs
var RunescapeCommands = require(__dirname + '/RunescapeCommands.js');  //Invention Cheat Sheets and Farming Harvest Time Reminders

//control of the bot is extended to the terminal to assist running on remote webservers
//node -e 'require("./BotController").Start()'
module.exports.Start = function()
{
  global.SwaeloBot = new SwaeloBot.SwaeloBot();
  global.CommandHandler = new CommandHandler.CommandHandler();
  global.CommandHandler.RegisterGroup(new RunescapeCommands.RunescapeCommands());
  global.SwaeloBot.Login();
};