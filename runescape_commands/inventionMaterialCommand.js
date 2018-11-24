var CommandClass = require(__dirname + '/../Command.js');
var RunescapeErrorMessages = require(__dirname + '/RunescapeErrorMessages.json');
var RunescapeCommandExamples = require(__dirname + '/runescapeCommandExamples.json');
var InventionMaterialImages = require(__dirname + '/inventionMaterialImages.json');

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
        //Give the correct information based on what arguments were provived
        var file = '';
        switch(args)
        {
            case 'base parts':
                file = InventionMaterialImages.BaseParts;
                break;
            case 'blade parts':
                file = InventionMaterialImages.BladeParts;
                break;
            case 'clear parts':
                file = InventionMaterialImages.ClearParts;
                break;
            case 'connector parts':
                file = InventionMaterialImages.ConnectorParts;
                break;
            case 'cover parts':
                file = InventionMaterialImages.CoverParts;
                break;
            case 'crafted parts':
                file = InventionMaterialImages.CraftedParts;
                break;
            case 'crystal parts':
                file = InventionMaterialImages.CrystalParts;
                break;
            case 'deflecting parts':
                file = InventionMaterialImages.DeflectingParts;
                break;
            case 'delicate parts':
                file = InventionMaterialImages.DelicateParts;
                break;
            case 'flexible parts':
                file = InventionMaterialImages.FlexibleParts;
                break;
            case 'head parts':
                file = InventionMaterialImages.HeadParts;
                break;
            case 'magic parts':
                file = InventionMaterialImages.MagicParts;
                break;
            case 'metallic parts':
                file = InventionMaterialImages.MetallicParts;
                break;
            case 'organic parts':
                file = InventionMaterialImages.OrganicParts;
                break;
            case 'padded parts':
                file = InventionMaterialImages.PaddedParts;
                break;
            case 'plated parts':
                file = InventionMaterialImages.PlatedParts;
                break;
            case 'simple parts':
                file = InventionMaterialImages.SimpleParts;
                break;
            case 'smooth parts':
                file = InventionMaterialImages.SmoothParts;
                break;
            case 'spiked parts':
                file = InventionMaterialImages.SpikedParts;
                break;
            case 'spiritual parts':
                file = InventionMaterialImages.SpiritualParts;
                break;
            case 'stave parts':
                file = InventionMaterialImages.StaveParts;
                break;
            case 'tensile parts':
                file = InventionMaterialImages.TensileParts;
                break;
        }

        //If we found a file matching the given name display it to the user
        if(file != '')
        {
            msg.channel.send('', {
                file: file
            });
            return;
        }

        //If this code is reached, no valid material name was given
        msg.channel.send(RunescapeErrorMessages.InvalidMaterialName);
        return;
    }
}

module.exports.InventionMaterialCommand = InventionMaterialCommand;
