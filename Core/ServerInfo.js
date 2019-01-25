//File System is used to save and load information regarding each server to keep everything
//active between lifetimes
const FileSystem = require('fs');
var FarmingLog = require(__dirname + '/../Runescape/Farming/FarmingLog.js');

//contains information about a specific server the bot is connected to
class ServerInfo
{
    constructor(NewServer)
    {
        //Basic info
        this.Server = NewServer; //discord server/guild we are connected to
        this.ServerID = NewServer.id;   //the id number of the guild

        //Info related to what voice channel we are connected to
        this.InVoice = false;   //is the bot currently in a voice channel of this server?
        this.VoiceChannel = -1; //what voice channel we are connected to in this server
        this.VoiceConnection = null;  //the voice connection for outputting music to

        //Info regarding active music playback and the list of songs we are playing
        this.PlayingMusic = false; //is the bot currently playing music for anyone
        this.MusicPaused = false; //is the currently song paused or not
        this.SongList = []; //the complete list of songs that have been requested so far
        this.Dispatcher = null; //dispatcher for outputting youtube audio to the voice chat

        //Keep seperate, the farming timers for each user, per server
        this.FarmingLogs = [];

        //Check if there is any local data referencing this server
        var FileSaveName = (__dirname + '/../SaveFiles/' + this.ServerID + '.json');
        if(FileSystem.existsSync(FileSaveName))//If we can find a backup save file load all the info from it
            this.LoadSaveData(FileSaveName);//Load in all the current farming timers from this servers save file
    }

    async LoadSaveData(FileName)
    {
        //Load the save file in
        var SaveFile = require(FileName);

        //Extract the set of crop timers and animal timers
        var FileCropLogList = SaveFile.crops;
        var FileAnimalLogList = SaveFile.animals;
        var CropLogs = FileCropLogList.split(' ');
        var AnimalLogs = FileAnimalLogList.split(' ');

        //Loop through the set of crop timers
        for(var CropLogIterator = 0; CropLogIterator < CropLogs.length; CropLogIterator++)
        {
            //Get the current list of crop timers from the complete set as we loop through the list
            var CropTimers = CropLogs[CropLogIterator].split('-');
            //Find the owner of this crop timer
            var CropOwner = CropTimers[0];
            CropTimers.shift();
            //Create a new farming log object to store all of this users crop timers
            var NewFarmingLog = new FarmingLog.FarmingLog(0);
            NewFarmingLog.UserID = CropOwner;
            //Loop through each crop timer stored for this user
            for(var CropTimerIterator = 0; CropTimerIterator < CropTimers.length; CropTimerIterator++)
            {
                //Extract the info for each crop timer and add them all into the users farming log object
                var TimerSplit = CropTimers[CropTimerIterator].split(':');
                var CropType = TimerSplit[0];
                var CropTimer = TimerSplit[1];
                NewFarmingLog.SetCropTimer(CropType, CropTimer);
            }
            //As the farming log object has been filled with all the users crop timers, store it with the rest of the farming logs
            this.FarmingLogs.push(NewFarmingLog);
        }

        //Loop through the set of animal timers
        for(var AnimalLogIterator = 0; AnimalLogIterator < AnimalLogs.length; AnimalLogIterator++)
        {
            //Get the current list of animal timers from the complete set as we loop through the list
            var AnimalTimers = AnimalLogs[AnimalLogIterator].split('-');
            //Find the owner of this animal timer
            var AnimalOwner = AnimalTimers[0];
            AnimalTimers.shift();
            //Try to find an already existing farming log object related to this user id, if it doesnt exist a newly created log will be returned which has already been stored
            var CurrentFarmingLog = this.GetFarmingTimerLog(AnimalOwner);
            //Loop through each animal timer stored for this user
            for(var AnimalTimerIterator = 0; AnimalTimerIterator < AnimalTimers.length; AnimalTimerIterator++)
            {
                //Extract the info for each animal timer and add them all into the users farming log object
                var TimerSplit = AnimalTimers[AnimalTimerIterator].split(':');
                var AnimalType = TimerSplit[0];
                var AnimalTimer = TimerSplit[1];
                CurrentFarmingLog.SetAnimalTimer(AnimalType, AnimalTimer);
            }
            //If
        }
    }

    async UpdateSaveData()
    {
        //Figure out what the filename would be for this server backup file
        var FileName = (__dirname + '/../SaveFiles/' + this.ServerID + '.json');

        //Add whatever songs are in the current song list into the save data file
        var Songs = '';
        for(var i = 0; i < this.SongList.length; i++)
        {
            Songs += this.SongList[i];
            if(i < this.SongList.length - 1)
                Songs += ' ';
        }

        //Save all of the farming logs each containing crop timers and animal timers for each seperate user and store it all in the servers save data backup file
        var Timers = '';
        for(var FarmingLogIterator = 0; FarmingLogIterator < this.FarmingLogs.length; FarmingLogIterator++)
        {
            //Get the info regarding each farming log stored within this server as we loop through the entire list of them
            var FarmingLog = this.FarmingLogs[FarmingLogIterator];

            //Get the complete list of crop times stored within the current farming log in the list as we loop through them all
            var CropTimers = FarmingLog.CropTimers;
            //First we will loop through the crop timers, appending to a CropTimerString object the current status of each crop timer
            var CropTimerString = FarmingLog.UserID + '-';
            for(var CropTimerIterator = 0; CropTimerIterator < CropTimers.length; CropTimerIterator++)
            {
                //Get the info regarding the current crop timer we are checking and append it onto the CropTimerString object
                var CropTimer = CropTimers[CropTimerIterator];
                CropTimerString += (CropTimer.CropName + ':' + CropTimer.Timer);

                //Space out each crop timer value with a - so they dont get mixed up together
                if(CropTimerIterator < CropTimers.length - 1)
                    CropTimerString += '-';
            }

            //Get the complete list of animal times stored within the current farming log in the list as we loop through them all
            var AnimalTimers = FarmingLog.AnimalTimers;
            //Second we will loop through the animal timers, appending to a AnimalTimerString object the current status of each animal timer
            var AnimalTimerString = FarmingLog.UserID + '-';
            for(var AnimalTimerIterator = 0; AnimalTimerIterator < AnimalTimers.length; AnimalTimerIterator++)
            {
                //Get the info regarding the current animal timer we are checking and append it onto the AnimalTimerString object
                var AnimalTimer = AnimalTimers[AnimalTimerIterator];
                AnimalTimerString += (AnimalTimer.AnimalName + ':' + AnimalTimer.Timer);

                //Space out each animal timer value with a - so they dont get mixed up together
                if(AnimalTimerIterator < AnimalTimers.length - 1)
                    AnimalTimerString += '-';
            }
        }

        //structure this data properly so it can be saved in json file format
        var ServerData = {
            songs: Songs,
            crops: CropTimerString,
            animals: AnimalTimerString
        };
        //Finally we have all the data ready, save it into our backup data file, then register a callback function to trigger once the file has been saved correctly
        var SaveData = JSON.stringify(ServerData);
        FileSystem.writeFile(FileName, SaveData, 'utf8', this.BackupComplete);
        return;
    }

    //callback event when server back is complete
    BackupComplete()
    {
        console.log('server info backed up successfully ');
    }

    //Returns the farming timer log for the requested discord user ID
    GetFarmingTimerLog(UserID)
    {
        //Loop through all of the farming logs currently being stored by this server
        var FarmingLogCount = this.FarmingLogs.length;
        for(var FarmingLogIterator = 0; FarmingLogIterator < FarmingLogCount; FarmingLogIterator++)
        {
            //Get the relevant information regarding the currently farming log that we are checking
            var CurrentFarmingLog = this.FarmingLogs[FarmingLogIterator];
            //If this farming log belongs to the user who's log we are searching for then return that log object
            if(CurrentFarmingLog.UserID == UserID)
                return CurrentFarmingLog;
        }
        //If there was no active farming log that already exists for the given UserID, create a new log for them, store it and return it
        var NewFarmingLog = new FarmingLog.FarmingLog(0);
        NewFarmingLog.UserID = UserID;
        this.FarmingLogs.push(NewFarmingLog);
        return NewFarmingLog;
    }

    //Returns the farming timer log for the requested discord user
    GetFarmingLog(DiscordUser)
    {
        for(var i = 0; i < this.FarmingLogs.length; i++)
        {
            if(DiscordUser.id == this.FarmingLogs[i].UserID)
                return this.FarmingLogs[i];
        }

        //If we have no log for this user yet, create a new one for them and return that
        var NewLog = new FarmingLog.FarmingLog(DiscordUser);
        this.FarmingLogs.push(NewLog);
        return NewLog;
    }
}

module.exports.ServerInfo = ServerInfo;
