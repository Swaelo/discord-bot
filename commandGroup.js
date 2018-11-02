//Manages each command in this group and passes on command arguments to the correct area
class CommandGroup
{
    constructor(GroupName)
    {
        this.CommandGroupName = GroupName;
        this.Commands = [];
    }

    AddNewCommand(NewCommand)
    {
        this.Commands.push(NewCommand);
    }

    //CommandHandler will pass messages to us with this command, we need to check if we can process that or not and let it know if we did
    HandleCommand(msg)
    {
        //cut the command prefix off the start
        var msgCut = msg.content.substring(1);

        //Check each command in this group to find one that matches
        for(var i = 0; i < this.Commands.length; i++)
        {
            //If the start of the message matches a trigger then thats the command we want to call
            var CommandMatch = msgCut.startsWith(this.Commands[i].CommandTrigger);
            if(CommandMatch)
            {
                this.Commands[i].CommandCallback(msg);
                return true;
            }
        }
        return false;
    }
}

module.exports.CommandGroup = CommandGroup;
