var CommandGroupClass = require(__dirname + '/../CommandGroup.js');
var HelpCommandClass = require(__dirname + '/helpCommand.js');
var SetNickCommandClass = require(__dirname + '/setNickCommand.js');

class GeneralCommandGroup extends CommandGroupClass.CommandGroup
{
    constructor()
    {
        super('general');
        this.AddNewCommand(new HelpCommandClass.HelpCommand());
        this.AddNewCommand(new SetNickCommandClass.SetNickCommand());
    }
}

module.exports.GeneralCommandGroup = GeneralCommandGroup;
