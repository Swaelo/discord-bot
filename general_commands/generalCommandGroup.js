var CommandGroupClass = require(__dirname + '/../CommandGroup.js');
var HelpCommandClass = require(__dirname + '/helpCommand.js');

class GeneralCommandGroup extends CommandGroupClass.CommandGroup
{
    constructor()
    {
        super('general');
        this.AddNewCommand(new HelpCommandClass.HelpCommand());
    }
}

module.exports.GeneralCommandGroup = GeneralCommandGroup;
