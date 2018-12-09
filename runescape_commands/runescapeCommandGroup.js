var CommandGroupClass = require(__dirname + '/../CommandGroup.js');
var InventionMaterialCommand = require(__dirname + '/inventionMaterialCommand.js');
var FarmingReminderCommandClass = require(__dirname + '/farmingReminder.js');

class RunescapeCommandGroup extends CommandGroupClass.CommandGroup
{
    constructor()
    {
        super('runescape');

        //Load in invention material charts
        this.AddNewCommand(new InventionMaterialCommand.InventionMaterialCommand());

        //Load the farming reminders class, tell it to load data from file before adding it to
        //the command group
        var FarmingReminderClass = new FarmingReminderCommandClass.FarmingReminderCommand();
        FarmingReminderClass.LoadLogFile();
        global.FarmingReminder = FarmingReminderClass;
        this.AddNewCommand(FarmingReminderClass);
    }
}

module.exports.RunescapeCommandGroup = RunescapeCommandGroup;
