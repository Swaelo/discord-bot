var Command = require(__dirname + '/../../Core/Command.js');
var FarmingCrops = require(__dirname + '/FarmingCrops.json');
var ErrorMessages = require(__dirname + '/../../Core/ErrorMessages.json');

class FarmingCommands extends Command.Command
{
    constructor()
    {
        super('farming');
        this.CommandCallback = this.Execute;
        //have a quick look through the crop types file and take note of what crops are supported
        this.CropTypes = [];
        for(var JSONKey in FarmingCrops) {
            this.CropTypes.push(JSONKey);
        }
        //extend global access so interval timer can easily find it
        global.FarmingCommands = this;
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

        //execute subcommand
        switch(FarmingSubCommand)
        {
          case 'timer':
            this.FarmingTimer(UserMessage, Arguments);
            return;
          case 'status':
            this.DisplayTimers(UserMessage, Arguments);
            return;
        }
    }

    //Displays the current status of all the users farming timers
    async DisplayTimers(UserMessage, Arguments)
    {
        var Reply = await UserMessage.channel.send('Looking up your farming logs...');
        //First we need to find the info about the server were in
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        //Get this users farming log
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        var LogMessage = ('---' + UserMessage.author.username + 's farming timers---\n');
        for(var TimerIterator = 0; TimerIterator < FarmingLog.CropTimers.length; TimerIterator++)
        {
            //Get the status of each crop and append it into the message
            var CurrentTimer = FarmingLog.CropTimers[TimerIterator];
            var Type = CurrentTimer.CropName;
            var TimeLeft = CurrentTimer.Timer - this.GetCurrentTime();
            //Timers at 0 are inactive
            if(CurrentTimer.Timer == 0)
                LogMessage += (Type + ': Inactive\n');
            else
            {
                //Active timers display the time remaining
                var Seconds = TimeLeft / 1000;
                Seconds = Math.floor(Seconds);
                var Minutes = Math.floor(Seconds / 60);
                Seconds -= Math.floor(Minutes * 60);
                var Hours = Math.floor(Minutes / 60);
                Minutes -= Math.floor(Hours * 60);

                //Display this timer in the list
                LogMessage += (Type + ': ');
                LogMessage += Hours > 0 ? (Hours + 'h') : '';
                LogMessage += Minutes + 'm' + Seconds + 's remaining\n';
            }
        }
        //display the message
        Reply.edit(LogMessage);
    }

    //Checks if any of the current farming timers are completed and notifies the user once they are
    CheckCropTimers()
    {
        //We need to check each seperate server that we are connected to
        var ServerList = global.Servers;
        var ServerCount = ServerList.length;
        for(var ServerIterator = 0; ServerIterator < ServerCount; ServerIterator++)
        {
            //For each server we check, there will be a set of farming logs, one for each User
            var CurrentServer = ServerList[ServerIterator];
            var LogList = CurrentServer.FarmingLogs;
            var LogCount = LogList.length;
            for(var LogIterator = 0; LogIterator < LogCount; LogIterator++)
            {
                var CurrentLog = LogList[LogIterator];
                //For each farming log, we need to check each farming timer contained within
                var TimerList = CurrentLog.CropTimers;
                var TimerCount = TimerList.length;
                for(var TimerIterator = 0; TimerIterator < TimerCount; TimerIterator++)
                {
                    var CurrentTimer = TimerList[TimerIterator];
                    var TimerType = CurrentTimer.CropName;
                    var TimerValue = CurrentTimer.Timer;
                    //ignore inactive timers
                    if(TimerValue == 0)
                        continue;

                    //Check if this timer is finished yet
                    var TimerRemaining = TimerValue - this.GetCurrentTime();
                    var TimerComplete = TimerRemaining <= 0;
                    if(TimerComplete)
                    {
                        //If the timer is complete, notify the user, reset the timer and update the save file
                        CurrentTimer.EndTimer();
                        var TimerOwner = this.FindUser(CurrentLog.UserID);
                        TimerOwner.user.sendMessage(FarmingCrops[CurrentTimer.CropName].harvestMessage);
                        CurrentServer.UpdateSaveData();
                    }
                }
            }
        }
    }

    //checks the connected servers for the person with given user id
    FindUser(UserID)
    {
        //Check each server until we find one they are in
        for(var i = 0; i < global.Servers.length; i++)
        {
            var CurrentServer = global.Servers[i].Server;
            var ServerMembers = CurrentServer.members;
            //Check if the user were looking for is in this member list
            var User = ServerMembers.get(UserID);
            //If we found the user return them
            if(User)
                return User;
        }
    }

    async FarmingTimer(UserMessage, CropType)
    {
        var Reply = await UserMessage.channel.send('Setting a new ' + CropType + ' farming timer for ' + UserMessage.author.username);

        //ignore this timer request if we dont support the crop they are asking for
        if(!FarmingCrops.hasOwnProperty(CropType))
        {
            Reply.edit('Sorry, I dont support that crop type yet. Ask Cymi human to add it for you');
            return;
        }

        //First we need to find the info about the server were in
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        //Check if the server is already tracking farming timers for this user
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        //Look in their log for the timer regarding this specific crop
        var CropTimer = FarmingLog.GetTimer(CropType);
        //If the timer is zero, we reset it
        if(CropTimer.GetTimer() == 0)
        {
            CropTimer.ResetTimer();
            Reply.edit(FarmingCrops[CropType].plantMessage);
            //Every time a new timer is reset, we need to resave the server info to file
            CurrentServer.UpdateSaveData();
            return;
        }//otherwise display time remaining for ongoing timers
        else
        {
            var TimeLeft = CropTimer.GetTimer() - this.GetCurrentTime();

            var Seconds = TimeLeft / 1000;
            Seconds = Math.floor(Seconds);
            var Minutes = Math.floor(Seconds / 60);
            Seconds -= Math.floor(Minutes * 60);
            var Hours = Math.floor(Minutes / 60);
            Minutes -= Math.floor(Hours * 60);

            var TimeLeftMessage = (FarmingCrops[CropType].plantMessage + '\n');
            TimeLeftMessage += ('This timer will complete in ' + Hours + 'h' + Minutes + 'm' + Seconds + 's.');
            Reply.edit(TimeLeftMessage);
            return;
        }
    }

    GetCurrentTime()
    {
      var CurrentDate = new Date();
      return CurrentDate.getTime();
    }

    //Finds the server info class for the server were connected to
    GetServerInfo(ServerID)
    {
        var ServerList = global.Servers;
        var ServerCount = ServerList.length;
        for(var ServerIterator = 0; ServerIterator < ServerCount; ServerIterator++)
        {
            var CurrentServer = ServerList[ServerIterator];
            var IDMatch = ServerID == CurrentServer.ServerID;
            if(IDMatch)
                return CurrentServer;
        }
    }
}

module.exports.FarmingCommands = FarmingCommands;
