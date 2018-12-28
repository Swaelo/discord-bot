var ErrorMessages = require(__dirname + '/ErrorMessages.json');

//manages a group of commands added to the discord bot
class CommandGroup
{
  //constructor
  constructor(GroupName)
  {
      this.CommandGroupName = GroupName; 
      this.Commands = [];
  }
  
  //Adds a new command to this command group
  AddNewCommand(NewCommand)
  {
      this.Commands.push(NewCommand); 
  }
  
  //Takes a message from the user and checks it against all the commands in this group to see
  //if the users input is valid input for any of our commands
  HandleCommand(UserMessage)
  {
    //process the input and extra the important information
    var InputLower = UserMessage.content.toLowerCase();
    var InputSplit = InputLower.split(' ');
    //If the split didnt make enough pieces the input is rubbish
    if(InputSplit.length <= 1)
    {
      UserMessage.channel.send(ErrorMessages.NotEnoughArguments);
      return;
    }
    //Get the name of the command the user is trying to use, push it off then anything else left is arguments to pass with it
    var CommandName = InputSplit[0];
    CommandName = CommandName.substr(1);//Remove the command prefix
    InputSplit.shift();//isolate the arguments
    var CommandArguments = this.FormatArgs(InputSplit);//format arguments together
    //Check each command in this group
    for(var i = 0; i < this.Commands.length; i++)
    {
      var Command = this.Commands[i];
      //Look for the matching command
      if(Command.CommandTrigger == CommandName)
      {
        Command.CommandCallback(UserMessage);
        return true;
      }
    }
    return false;
  }
    
  //Reformats all the left over arguments back into a single string, with a space between each entry
  FormatArgs(Arguments)
  {
    var Formatted = '';
    for(var i = 0; i < Arguments.length; i++)
    {
      //concatenate
      Formatted += Arguments[i];
      if(i < Arguments.length -1)
        Formatted += ' ';
    }
    return Formatted;
  }
}

module.exports.CommandGroup = CommandGroup;