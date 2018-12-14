var Command = require(__dirname + '/Command.js');
var ErrorMessages = require(__dirname + '/ErrorMessages.json');
var FarmingCrops = require(__dirname + '/FarmingCrops.json');
var FarmingLog = require(__dirname + '/FarmingLog.js');

class FarmingCommands extends Command.Command
{
  constructor()
  {
    super('farming');
    this.CommandCallback = this.Execute;
    this.CropTypes = ['herb', 'morchella', 'grapevine', 'barberry', 'bloodwood', 'coconut', 'sweetcorn'];
    this.FarmingLogs = [];
  }
  
  Execute(UserMessage)
  {
    //process input
    var InputLower = UserMessage.content.toLowerCase();
    var InputSplit = InputLower.split(' ');
    //if after the split there is only one object, the command input is invalid
    if(InputSplit.length <= 1)
    {
      UserMessage.channel.send(ErrorMessages.NoCommandSelected);
      return;
    }
    //continue processing input
    InputSplit.shift();
    
    //check farming sub command
    var FarmingSubCommand = InputSplit[0];
    InputSplit.shift();
    //reformat left over to args
    var Arguments = this.FormatArgs(InputSplit);
    
    console.log('processing farming command...');
    console.log('sub command:' + FarmingSubCommand);
    console.log('args:' + Arguments);
    
    //execute subcommand
    switch(FarmingSubCommand)
    {
      case 'timer':
        this.FarmingTimer(UserMessage, Arguments);
        return;
    }
    
    //no sub command execution means invalid input
    UserMessage.channel.send(ErrorMessages.InvalidCommand);
    return;
  }
  
  FarmingTimer(UserMessage, CropType)
  {
    console.log('saving a new farming timer: ' + CropType);
    
    //Make sure we have the correct information on the type of crop the user wants us to keep track of
    if(!FarmingCrops.hasOwnProperty(CropType))
    {
      //Tell the user we dont know what crop they are talking about, or we dont have the info we need to track that crop
      UserMessage.channel.send(ErrorMessages.UnknownCrop);
      return;
    }
    
    //Search the database to see if there is any farming timers information about the player who used the command
    var UserLog = this.FindUserLog(UserMessage.author);
    console.log('found log? ' + UserLog);
    
    //Get the current time
    var Clock = new Date();
    var CurrentTime = parseInt(Clock.getTime());
    //Find the info about the type of crop the user is growing
    var CropData = FarmingCrops[CropType];
    //Get the current timer on this crop type from the users logs
    var CurrentTimer = UserLog[CropType];
    //If the timer for this crop is set to 0 we start up a brand new timer for it
    if(CurrentTimer == 0)
    {
      //Get the exact growth time for this type of crop
      var GrowthTime = parseInt(CropData.growthTime);
      //Figure out exactly when it will be ready for harvest
      var HarvestTime = CurrentTime + GrowthTime;
      //Save this new timer info to the users farming log, and notify them that the timer countdown has begun
      UserMessage.channel.send(CropData.plantMessage);
      UserLog[CropType] = HarvestTime;
    }
    //Otherwise if the timer hasnt hit yet, the crops arent ready for harvest yet
    else
    {
      //Figure out how much longer until harvest time
      var HarvestTime = parseInt(UserLog[CropType]);
      var TimeUntilHarvest = (HarvestTime - CurrentTime) / 1000;
      UserMessage.channel.send(CropData.growingMessage);
    }
  }
  
  FindUserLog(DiscordUser)
  {
    console.log('checking for previous farming logs of ' + DiscordUser.username + '.');
    
    //Checks through any existing logs to see if we already have information on this user
    for(var i = 0; i < this.FarmingLogs.length; i++)
    {
      if(this.FarmingLogs[i].UserID == DiscordUser.id)
      {
        console.log('existing log was found.');
        return this.FarmingLogs[i]; 
      }
    }
    
    console.log('not found, create new log for them.');
    //If no log was found, create a new one for this user and store it with the others
    var NewLog = new FarmingLog.FarmingLog(DiscordUser);
    this.FarmingLogs.push(NewLog);
    console.log('new log created for ' + NewLog.User.username + '.');
    return NewLog;
  }
  
  CheckCropTimers()
  {
    //If there arent any active timers just dont even worry about it
    if(this.FarmingLogs.length <= 0)
    {
      console.log('no farming logs to check!');
      return;
    }
    
    //Find out what the current time is
    var Clock = new Date();
    var CurrentTime = parseInt(Clock.getTime());
    //Now we know the time, check if anything is finished growing yet
    console.log(this.FarmingLogs.length + ' logs to check.');
    for(var i = 0; i < this.FarmingLogs.length; i++)
    {
      var FarmingLog = this.FarmingLogs[i];
      var LogTimers = FarmingLog.GetTimers();
      //We have all of this users farming timers
      console.log(LogTimers.length + ' Log Times to check.');
      for(var j = 0; j < LogTimers.length; j++)
      {
        var TimerValue = parseInt(LogTimers[j]);
        //ignore non zeroes
        if(TimerValue != 0)
        {
          var TimerType = this.CropTypes[j];
          console.log('there is a ' + TimerType + ' timer set to ' + TimerValue + '.');
          //Find out when the time is complete
          var TimerEnd = TimerValue - CurrentTime;
          //If the timer is over, notify the user their plants are ready to harvest
          //and reset the timer in the users farming log
          if(TimerEnd <= 0)
          {
            console.log('this timer has concluded, notifying user.');
            FarmingLog.User.sendMessage(FarmingCrops[TimerType].harvestMessage);
            FarmingLog[TimerType] = 0;
          }
        }
      }
    }
  }
  
  //Takes in a presumably massive number of seconds, reshuffles it and displays it to the chat channel in hours/minutes/seconds
  DisplayTimeRemaining(SecondsRemaining, UserMessage)
  {
    var TotalSeconds = Math.floor(SecondsRemaining);
    var TotalMinutes = Math.floor(SecondsRemaining / 60);
    TotalSeconds -= Math.floor(TotalMinutes * 60);
    var TotalHours = Math.floor(TotalMinutes / 60);
    TotalMinutes -= Math.floor(TotalHours * 60);

    UserMessage.channel.send('This timer will complete in ' + TotalHours + ' hours, ' + TotalMinutes + ' minutes and ' + TotalSeconds + ' seconds time.');
  }
  
  
  
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

module.exports.FarmingCommands = FarmingCommands;