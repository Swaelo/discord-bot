var CommandGroup = require(__dirname + '/CommandGroup.js');
var InventionCommands = require(__dirname + '/InventionCommands.js');
var FarmingCommands = require(__dirname + '/FarmingCommands.js');

class RunescapeCommands extends CommandGroup.CommandGroup
{
  constructor()
  {
    super('runescape');
    
    //Load in our master commands for each runescape skill
    this.AddNewCommand(new InventionCommands.InventionCommands());
    //Farming Command set up a bit different to expose its check timers command to the bots interval timer
    var Farming = new FarmingCommands.FarmingCommands();
    global.FarmingCommands = Farming;
    this.AddNewCommand(Farming);
  }
}

module.exports.RunescapeCommands = RunescapeCommands;