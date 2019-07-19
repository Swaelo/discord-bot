var Command = require(__dirname + '/../../Core/Command.js');
var ErrorMessages = require(__dirname + '/../../Core/ErrorMessages.json');

class PortsCommands extends Command.Command
{
    constructor()
    {
        super('ports');
        this.CommandCallback = this.Execute;
        global.PortsCommands = this;
    }

    Execute(UserMessage)
    {
        //process the input
        var InputLower = UserMessage.content.toLowerCase();
        var InputSplit = InputLower.split(' ');

        //if after the split there is only one object the input is invalid
        if(InputSplit.length <= 1)
        {
            UserMessage.channel.send(ErrorMessages.NoCommandSelected);
            return;
        }

        //Continue input processing
        InputSplit.shift();

        //Check what sub command has been passed in
        var PortsSubCommand = InputSplit[0] + ' ' + InputSplit[1];
        InputSplit.shift();
        InputSplit.shift();
        //reformat left over to args
        var Arguments = this.FormatArgs(InputSplit);

        //execute the subcommand
        switch(PortsSubCommand)
        {
            case 'voyage timer':
                this.VoyageTimer(UserMessage, Arguments);
                return;
        }
    }

    //Starts a new voyage timer for the users player owned port
    async VoyageTimer(UserMessage, Arguments)
    {
        //Let the user know their request has been recieved
        var Reply = await UserMessage.channel.send('Setting a new voyage alert timer for ' + UserMessage.author.username);

        //Ignore the request if the arguments provided are what is expected
        var ArgumentSplit = Arguments.split(' ');
        if(ArgumentSplit.length != 3)
        {
            Reply.edit('Invalid command syntax, try like this: ``*ports timer BoatName 1 30``');
            return;
        }
    }
}