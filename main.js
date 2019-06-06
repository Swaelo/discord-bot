var SwaeloBot = require(__dirname + '/Core/SwaeloBot.js');  //Swaelo Bot class for Discord Fun
var CommandGroup = require(__dirname + '/Core/CommandGroup.js');  //Commands for the Bot are organized into groups
var CommandHandler = require(__dirname + '/Core/CommandHandler.js');  //Groups are managed by the command handler, all input is sent to the handler, it does magic and gets it where it belongs
//var RunescapeCommands = require(__dirname + '/Runescape/RunescapeCommands.js');  //Invention Cheat Sheets and Farming Harvest Time Reminders
var MusicPlayer = require(__dirname + '/Music/MusicPlayer.js');
global.SwaeloBot = new SwaeloBot.SwaeloBot();
global.CommandHandler = new CommandHandler.CommandHandler();
//global.CommandHandler.RegisterGroup(new RunescapeCommands.RunescapeCommands());
global.CommandHandler.RegisterGroup(new MusicPlayer.MusicPlayer());
global.SwaeloBot.Login();
