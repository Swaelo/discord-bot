var Command = require(__dirname + '/../../Core/Command.js');
var ErrorMessages = require(__dirname + '/../../Core/ErrorMessages.json');
var InventionMaterials = require(__dirname + '/InventionMaterials.json');

class InventionCommands extends Command.Command
{
  constructor()
  {
    super('invention');
    this.CommandCallback = this.Execute;
  }

  Execute(UserMessage)
  {
    //process input
    var InputLower = UserMessage.content.toLowerCase();
    var InputSplit = InputLower.split(' ');
    //if after the split there is only one object, the command input is invalid
    if(InputSplit.length == 1)
    {
      UserMessage.channel.send(ErrorMessages.NoCommandSelected);
      return;
    }
    //continue processing input
    InputSplit.shift();

    //check invention sub command
    var InventionSubCommand = InputSplit[0];
    InputSplit.shift();

    //reformat the leftover args
    var Arguments = this.FormatArgs(InputSplit);

    //execute invention sub command
    switch(InventionSubCommand)
    {
      case 'material':
        this.MaterialCommand(UserMessage, Arguments);
        return;
    }

    //no sub command execution means invalid input
    UserMessage.channel.send(ErrorMessages.InvalidCommand);
    return;
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

  //Displays relevant and helpful information about the invention material enquired about
  MaterialCommand(UserMessage, InventionMaterial)
  {
    //Make sure the material they ask about exists
    if(!InventionMaterials.hasOwnProperty(InventionMaterial))
    {
      UserMessage.channel.send(ErrorMessages.InvalidMaterialName);
      return;
    }

    //The material exists, grabs the information and display it to the user
    var Material = InventionMaterials[InventionMaterial];
    var Description = '[wiki page](' + Material.wiki + ')\n[dissassembly page](' + Material.dissassembly + ')';
    UserMessage.channel.send({embed: {
      description: Description,
      color: 486109,
      image: {
        url: Material.image
      }
    }});
  }

  //Displays info about the requested invention perk

}

module.exports.InventionCommands = InventionCommands;
