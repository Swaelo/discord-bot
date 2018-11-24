var CommandGroupClass = require(__dirname + '/../CommandGroup.js');
var InventionMaterialCommand = require(__dirname + '/inventionMaterialCommand.js');
var FarmingTimerCommand = require(__dirname + '/farmingTimerCommand.js');

class RunescapeCommandGroup extends CommandGroupClass.CommandGroup
{
    constructor()
    {
        super('runescape');
        this.AddNewCommand(new InventionMaterialCommand.InventionMaterialCommand());
        this.AddNewCommand(new FarmingTimerCommand.FarmingTimerCommand());
    }
}

module.exports.RunescapeCommandGroup = RunescapeCommandGroup;
