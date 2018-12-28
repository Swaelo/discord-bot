//The command handler manages all of the command groups which have been added and dishes out
//user input strings to the correct command functions
class CommandHandler
{
  //constructor
  constructor()
  {
      this.Prefix = '$';
      this.CommandGroups = [];
  }

  //Adds a new group of commands to the handler
  RegisterGroup(NewGroup)
  {
    this.CommandGroups.push(NewGroup);
  }

  //Every message from the chat is passed to this function, then it passes the input on to the
  //correct command functions if it matches what it should be for that command
  HandleCommand(UserMessage)
  {
    //Ignore any messages which dont begin with the specified command prefix
    if(!UserMessage.content.startsWith(this.Prefix))
      return;

    //Loop through each command group that has been added, checking each until we the correct location to send the users input for execution
    for(var i = 0; i < this.CommandGroups.length; i++)
    {
      //Check each command group registered to the handler
      var CommandGroup = this.CommandGroups[i];
      var CommandHandled = CommandGroup.HandleCommand(UserMessage);
      //continue checking everything until we find a match
      if(CommandHandled)
        return;
    }
  }
}
module.exports.CommandHandler = CommandHandler;
