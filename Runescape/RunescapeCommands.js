var CommandGroup = require(__dirname + '/../Core/CommandGroup.js');
var InventionCommands = require(__dirname + '/Invention/InventionCommands.js');
var FarmingCommands = require(__dirname + '/Farming/FarmingCommands.js');
//var CitadelCommands = require(__dirname + '/Citadel/CitadelCommands.js');

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
    
    //citadel commands to help track who has capped each week
    //this.AddNewCommand(new CitadelCommands.CitadelCommands());
  }
}

module.exports.RunescapeCommands = RunescapeCommands;
