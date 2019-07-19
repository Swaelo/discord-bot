var Command = require(__dirname + '/../../Core/Command.js');
var FarmingCrops = require(__dirname + '/FarmingCrops.json');
var FarmAnimals = require(__dirname + '/FarmAnimals.json');
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
        var FarmingSubCommand = InputSplit[0] + ' ' + InputSplit[1];
        InputSplit.shift();
        InputSplit.shift();
        //reformat left over to args
        var Arguments = this.FormatArgs(InputSplit);

        //execute subcommand
        switch(FarmingSubCommand)
        {
            case 'crop timer':
                this.CropTimer(UserMessage, Arguments);
                return;
            case 'crop status':
                this.DisplayCropTimers(UserMessage, Arguments);
                return;
            case 'animal timer':
                this.AnimalTimer(UserMessage, Arguments);
                return;
            case 'animal status':
                this.DisplayAnimalTimers(UserMessage, Arguments);
                return;
            case 'ports timer':
                this.PortsTimer(UserMessage, Arguments);
                return;
            case 'ports status':
                this.DisplayVoyageTimers(UserMessage, Arguments);
                return;
        }
    }

    //Displays the current status of all the users animal timers
    async DisplayAnimalTimers(UserMessage, Arguments)
    {
        var Reply = await UserMessage.channel.send('Looking up your farming animal logs...');
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        var LogMessage = ('---' + UserMessage.author.username + 's animal timers---\n');

        for(var TimerIterator = 0; TimerIterator < FarmingLog.AnimalTimers.length; TimerIterator++)
        {
            var CurrentTimer = FarmingLog.AnimalTimers[TimerIterator];
            var Type = CurrentTimer.AnimalName;
            var TimeLeft = CurrentTimer.Timer - this.GetCurrentTime();

            if(CurrentTimer.Timer == 0)
                continue;
            else
            {
                var Seconds = TimeLeft / 1000;
                Seconds = Math.floor(Seconds);
                var Minutes = Math.floor(Seconds / 60);
                Seconds -= Math.floor(Minutes * 60);
                var Hours = Math.floor(Minutes / 60);
                Minutes -= Math.floor(Hours * 60);

                LogMessage += (Type + ': ');
                LogMessage += Hours > 0 ? (Hours + 'h') : '';
                LogMessage += Minutes + 'm' + Seconds + 's remaining\n';
            }
        }
        //check there wasnt actually 0 active animal timers
        if(LogMessage == ('---' + UserMessage.author.username + 's animal timers---\n'))
        {
            Reply.edit('You have no active animal timers.');
            return;
        }
        else
            Reply.edit(LogMessage);
    }

    //Displays the current status of all the users crop timers
    async DisplayCropTimers(UserMessage, Arguments)
    {
        var Reply = await UserMessage.channel.send('Looking up your farming crop logs...');
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
                continue;
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
        //check there wasnt actually 0 active crop timers
        if(LogMessage == ('---' + UserMessage.author.username + 's farming timers---\n'))
        {
            Reply.edit('You have no active crop timers.');
            return;
        }
        else//display the message
            Reply.edit(LogMessage);
    }

    //Displays the current status of all the users active ports voyage timers
    async DisplayVoyageTimers(UserMessage, Arguments)
    {
        //Let the user know their request has been recieved
        var Reply = await UserMessage.channel.send('Looking up your ports voyage logs...');
        
        //Get all the users current voyage timers
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        var VoyageTimers = FarmingLog.VoyageTimers;

        //Start a message to display the values of each active voyage timer
        var LogMessage = ('---' + UserMessage.author.username + 's voyage timers---\n');

        //Loop through all of the users active timers
        for(var TimerKey in VoyageTimers)
        {
            //Get the current values of each timer
            var CurrentTimer = VoyageTimers[TimerKey];
            var TimerName = CurrentTimer.ShipName;
            var TimeLeft = CurrentTimer.Timer - this.GetCurrentTime();

            //Skip inactive timers
            if(CurrentTimer.Timer == 0)
                continue;
            //Add active timers into to the LogMessage
            else
            {
                //Find out how much time it has left
                var Seconds = TimeLeft / 1000;
                Seconds = Math.floor(Seconds);
                var Minutes = Math.floor(Seconds / 60);
                Seconds -= Math.floor(Minutes * 60);
                var Hours = Math.floor(Minutes / 60);
                Minutes -= Math.floor(Hours * 60);

                //Add the info to the list
                LogMessage += (TimerName + ': ');
                LogMessage += Hours > 0 ? (Hours + 'h') : '';
                LogMessage += Minutes + 'm' + Seconds + 's remaining\n';  
            }
        }

        //Check there wasnt actually 0 active voyage timers
        if(LogMessage == ('---' + UserMessage.author.username + 's voyage timers---\n'))
        {
            Reply.edit('All ships are in dock.');
            return;
        }
        //Otherwise display the list of current timers to the user
        else
        {
            Reply.edit(LogMessage);
            return;
        }
    }

    //Checks all animal timers and all crop timers
    CheckAllTimers()
    {
        this.CheckAnimalTimers();
        this.CheckCropTimers();
        this.CheckVoyageTimers();
    }

    //Checks if any of the current farming animal timers are completed and notifies the user once they are
    CheckAnimalTimers()
    {
        //Get the info about every server we are currently connected to
        var ServerList = global.Servers;
        var ServerCount = ServerList.length;

        //Loop through every server we are connected to, as they each have their own set of farming logs that we need to check seperately
        for(var ServerIterator = 0; ServerIterator < ServerCount; ServerIterator++)
        {
            //Check the information about the current server and all the farming logs it is keeping track of right now
            var CurrentServer = ServerList[ServerIterator];
            var LogList = CurrentServer.FarmingLogs;
            var LogCount = LogList.length;

            //Loop through and check every farming log this server is keeping track of, there should be 1 for each seperate user
            for(var LogIterator = 0; LogIterator < LogCount; LogIterator++)
            {
                //Get the info for each farming log and the list of timers stored within it, for this server as we loop through the entire list of servers
                var CurrentLog = LogList[LogIterator];
                var TimerList = CurrentLog.AnimalTimers;
                var TimerCount = TimerList.length;

                //Loop through and check every timer in this current farming log that we are checking
                for(var TimerIterator = 0; TimerIterator < TimerCount; TimerIterator++)
                {
                    //Get the info about the current timer we are checking right now
                    var CurrentTimer = TimerList[TimerIterator];
                    var TimerType = CurrentTimer.AnimalName;
                    var TimerValue = CurrentTimer.Timer;

                    //Ignore any timers which are currently inactive
                    if(TimerValue == 0)
                        continue;

                    //For each active animal timer we need to check if enough time has passed that it has completed yet or not
                    var TimeRemaining = TimerValue - this.GetCurrentTime();
                    var TimerIsComplete = TimeRemaining <= 0;

                    //When a timer is found to be complete, we must notify the user about it, reset the timer and update the server backup save file
                    if(TimerIsComplete)
                    {
                        //Find the user who this timer belongs to and notify them it has completed now
                        CurrentTimer.EndTimer();
                        var TimerOwner = this.FindUser(CurrentLog.UserID);
                        TimerOwner.user.sendMessage(FarmAnimals[CurrentTimer.AnimalName].adolescenceReachedMessage);
                        CurrentServer.UpdateSaveData();
                    }
                }
            }
        }
    }

    //Checks if any of the current ports voyage timers are completed and notifies the user once they are
    CheckVoyageTimers()
    {
        //We need to check each seperate server we are currently connected to
        for(var ServerIterator = 0; ServerIterator < global.Servers.length; ServerIterator++)
        {
            //Get the info on each server in the list, then get each servers set of farming logs
            var CurrentServer = global.Servers[ServerIterator];
            var LogList = CurrentServer.FarmingLogs;
            for(var LogIterator = 0; LogIterator < LogList.length; LogIterator++)
            {
                //Get each users voyage timer dictionary and loop through all the timers in it
                var TimerDictionary = CurrentServer.FarmingLogs[LogIterator].VoyageTimers;
                for(var TimerKey in TimerDictionary)
                {
                    //Get the values of each timer as we loop through them all
                    var CurrentTimer = TimerDictionary[TimerKey];
                    var TimerName = CurrentTimer.ShipName;
                    var TimerValue = CurrentTimer.Timer;

                    //Ignore inactive timers
                    if(TimerValue == 0)
                        continue;

                    //Check if active timers are completed yet
                    var TimeLeft = TimerValue - this.GetCurrentTime();
                    if(TimeLeft <= 0)
                    {
                        //Accounce completed timers to the user, then reset the timer and update the server save file
                        CurrentTimer.EndTimer();
                        var TimerOwner = this.FindUser(CurrentTimer.UserID);
                        TimerOwner.user.sendMessage(TimerName + ' has returned from their voyage and is waiting in port.');
                        CurrentServer.UpdateSaveData();
                    }
                }
            }
        }
    }

    //Checks if any of the current farming crop timers are completed and notifies the user once they are
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
                //For each farming log, we need to check each farming timer contained within
                var CurrentLog = LogList[LogIterator];
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

    async PortsTimer(UserMessage, Arguments)
    {
        //Let the user know their request has been recieved
        var Reply = await UserMessage.channel.send('Settings a new voyage timer for ' + UserMessage.author.username);

        //Ignore this request if the arguments provided are valid
        var ArgumentSplit = Arguments.split(' ');
        if(ArgumentSplit.length != 3)
        {
            Reply.edit('Incorrect number of arguments provided, correct command syntax looks like this: ``*farming ports timer BoatName 1 30``');
            return;
        }

        //Split the arguments apart into their seperate values
        var BoatName = ArgumentSplit[0];
        var Hours = ArgumentSplit[1];
        var Minutes = ArgumentSplit[2];

        //Timers need to be set with millisecond values
        var TotalSeconds = (Hours * 3600) + (Minutes * 60);
        var TotalMilliseconds = TotalSeconds * 1000;

        //Get the info on the current server, the users current farming log and the timer for the boat they are using
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        var VoyageTimer = FarmingLog.GetVoyageTimer(UserMessage.author.id, BoatName, TotalMilliseconds);

        //If the voyage timer is at zero we need to reset it
        if(VoyageTimer.GetTimer() == 0)
        {
            VoyageTimer.Override(Milliseconds);
            Reply.edit(BoatName + ' has left on their voyage. I will remind you when they return in approx ' + Hours + ' hours and ' + Minutes + ' minutes time.');
            //Update the server save file
            CurrentServer.UpdateSaveData();
            return;
        }
        //Otherwise we display how much time is remaining on the voyage
        else
        {
            //Figure out how much time is left
            var TimeLeft = VoyageTimer.GetTimer() - this.GetCurrentTime();
            var SecondsLeft = TimeLeft / 1000;
            SecondsLeft = Math.floor(SecondsLeft);
            var MinutesLeft = Math.floor(SecondsLeft / 60);
            SecondsLeft -= Math.floor(MinutesLeft * 60);
            var HoursLeft = Math.floor(MinutesLeft / 60);
            MinutesLeft -= Math.floor(HoursLeft * 60);

            //Display the remaining time
            var TimeLeftMessage = (BoatName + ' will return from its voyage in approx ' + HoursLeft + 'h' + MinutesLeft + 'm' + SecondsLeft + 's.');
            Reply.edit(TimeLeftMessage);
            //Update the server save file
            CurrentServer.UpdateSaveData();
            return;
        }
    }

    async AnimalTimer(UserMessage, AnimalType)
    {
        var Reply = await UserMessage.channel.send('Setting a new ' + AnimalType + ' farming timer for ' + UserMessage.author.username);
        if(!FarmAnimals.hasOwnProperty(AnimalType))
        {
            Reply.edit('Sorry, I dont know what animal youre talking about. Please check your spelling and try again.');
            return;
        }
        var CurrentServer = this.GetServerInfo(UserMessage.guild.id);
        var FarmingLog = CurrentServer.GetFarmingLog(UserMessage.author);
        var AnimalTimer = FarmingLog.GetAnimalTimer(AnimalType);
        if(AnimalTimer.GetTimer() == 0)
        {
            AnimalTimer.ResetTimer();
            Reply.edit(FarmAnimals[AnimalType].adolesentGrowthTimerStartedMessage);
            CurrentServer.UpdateSaveData();
            return;
        }
        else
        {
            var TimeLeft = AnimalTimer.GetTimer() - this.GetCurrentTime();

            var Seconds = TimeLeft / 1000;
            Seconds = Math.floor(Seconds);
            var Minutes = Math.floor(Seconds / 60);
            Seconds -= Math.floor(Minutes * 60);
            var Hours = Math.floor(Minutes / 60);
            Minutes -= Math.floor(Hours * 60);

            var TimeLeftMessage = (FarmAnimals[AnimalType].growingMessage + '\n');
            TimeLeftMessage += ('This timer will completed in ' + Hours + 'h' + Minutes + 'm' + Seconds + 's.');
            Reply.edit(TimeLeftMessage);
            //Update the server save file
            CurrentServer.UpdateSaveData();
            return;
        }
    }

    async CropTimer(UserMessage, CropType)
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
        var CropTimer = FarmingLog.GetCropTimer(CropType);

        //If the timer is zero, we reset it
        if(CropTimer.GetTimer() == 0)
        {
            CropTimer.ResetTimer();
            Reply.edit(FarmingCrops[CropType].plantMessage);
            //Every time a new timer is reset, we need to resave the server info to file
            CurrentServer.UpdateSaveData();
            return;
        }
        //otherwise display time remaining for ongoing timers
        else
        {
            //Figure out how much time this crop has left to grow
            var TimeLeft = CropTimer.GetTimer() - this.GetCurrentTime();
            var Seconds = TimeLeft / 1000;
            Seconds = Math.floor(Seconds);
            var Minutes = Math.floor(Seconds / 60);
            Seconds -= Math.floor(Minutes * 60);
            var Hours = Math.floor(Minutes / 60);
            Minutes -= Math.floor(Hours * 60);

            //tell the user how much time left until the crop finishes growing
            var TimeLeftMessage = (FarmingCrops[CropType].plantMessage + '\n');
            TimeLeftMessage += ('This timer will complete in ' + Hours + 'h' + Minutes + 'm' + Seconds + 's.');
            Reply.edit(TimeLeftMessage);

            //Update the server save file
            CurrentServer.UpdateSaveData();
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
