class CommandHandler
{
    constructor()
    {
        console.log('command handler initialised');
        this.commandPrefix = '*';
        this.commandGroups = [];
    }

    //Adds a group of commands to the handler so they will be called
    RegisterGroup(NewGroup)
    {
        this.commandGroups.push(NewGroup);
    }

    //Every message in the chat is processed through this command
    HandleCommand(msg)
    {
        //Only pay attention to message that start with our command prefix
        if(msg.content.startsWith(this.commandPrefix))
        {
            //Now loop through each command group, until we find one that can process our command
            for(var i = 0; i < this.commandGroups.length; i++)
            {
                var CommandHandled = this.commandGroups[i].HandleCommand(msg);
                //If the command was handled then we are finished
                if(CommandHandled)
                    return;
                //Otherwise we will move onto the next command group and try that one
            }
            //If none of the command groups worked, then let the user know we couldnt process their command
            msg.channel.send('Unable to process that command, sorry :(');
        }
    }
}

module.exports.CommandHandler = CommandHandler;
