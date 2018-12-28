var CommandGroup = require(__dirname + '/../Core/CommandGroup.js');
var MusicCommands = require(__dirname + '/MusicCommands.js');

class MusicPlayer extends CommandGroup.CommandGroup
{
  constructor()
  {
    super('music');
    this.AddNewCommand(new MusicCommands.MusicCommands());
  }
}

module.exports.MusicPlayer = MusicPlayer;
