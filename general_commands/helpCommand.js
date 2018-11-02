var CommandClass = require(__dirname + '/../Command.js');

class HelpCommand extends CommandClass.Command
{
    constructor()
    {
        super('help');
        this.CommandCallback = this.Execute;
    }

    Execute(msg)
    {
        msg.channel.send('sending help');
    }
}

module.exports.HelpCommand = HelpCommand;
