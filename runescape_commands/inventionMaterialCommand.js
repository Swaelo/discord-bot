var CommandClass = require(__dirname + '/../Command.js');
var RunescapeErrorMessages = require(__dirname + '/RunescapeErrorMessages.json');
var InventionMaterialInformation = require(__dirname + '/inventionMaterialLinks.json');

class InventionMaterialCommand extends CommandClass.Command
{
    constructor()
    {
        super('invention');
        this.CommandCallback = this.Execute;
    }

    Execute(msg)
    {
        //Take the string sent from the user, change all characters to lower case
        var UserInput = msg.content.toLowerCase();

        //Split the string with spaces so we can seperate the command name and arguments apart
        var UserInputSplit = UserInput.split(' ');

        //If the split resulted in only a single object, no command was selected
        if(UserInputSplit.length == 1)
        {
            msg.channel.send(RunescapeErrorMessages.NoCommandSelected);
            return;
        }

        //Remove the command call object as we already know we are doing an invention command
        UserInputSplit.shift();

        //Now we can seperate the command selection to see what it is
        var CommandSelection = UserInputSplit[0];
        //If there were any arguments passed with the command, recombine them
        var CommandArguments = '';
        for(var i = 1; i < UserInputSplit.length; i++)
        {
            //Concatenate each command onto the end
            CommandArguments += UserInputSplit[i];

            //Put a space between the arguments
            if(i < UserInputSplit.length - 1)
                CommandArguments += ' ';
        }

        //Find which command was called and pass information to it
        switch(CommandSelection)
        {
            case 'material':
                this.MaterialSearch(msg, CommandArguments);
                return;
        }

        //If this block of code is reached, no valid command has been detected
        msg.channel.send(RunescapeErrorMessages.InvalidCommand);
        return;
    }

    MaterialSearch(msg, args)
    {
        //Check to make sure the material the person is searching for actually exists
        if(!InventionMaterialInformation.hasOwnProperty(args))
        {
            //If this code is reached, no valid material name was given
            msg.channel.send(RunescapeErrorMessages.InvalidMaterialName);
            return;
        }

        //The material exists, lets grab its relevant information to be displayed
        var MaterialInformation = InventionMaterialInformation[args];
        var WikiLink = MaterialInformation.wiki;
        var DissassemblyLink = MaterialInformation.dissassembly;
        var ImageLink = MaterialInformation.image;

        var Description = '[wiki page](' + WikiLink + ')\n[dissassembly page](' + DissassemblyLink + ')';

        msg.channel.send({embed: {
            description: Description,
            color: 486109,
            image: {
                url: ImageLink
            }
        }});
    }
}

module.exports.InventionMaterialCommand = InventionMaterialCommand;
