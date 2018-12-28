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

        //Extract the song list
        var FileSongList = SaveFile.songs;

        //Extract the farming logs
        var FileFarmingLogList = SaveFile.logs;
        //each farming log is seperated by a space
        var FarmingLogs = FileFarmingLogList.split(' ');
        for(var i = 0; i < FarmingLogs.length; i++)
        {
            //inside each of the farming logs, each timer is seperated by a dash
            //we need to create a new farming log and place all the data into it as its loaded
            var NewFarmingLog = new FarmingLog.FarmingLog(0);
            var LogTimers = FarmingLogs[i].split('-');
            //the first is the user ID, then everything after that is another timer
            NewFarmingLog.UserID = LogTimers[0];
            LogTimers.shift();
            //go through each timer we need to keep track of
            for(var j = 0; j < LogTimers.length; j++)
            {
                //the herb type and timer are split by a :
                var TimerSplit = LogTimers[j].split(':');
                var TimerType = TimerSplit[0];
                var TimerValue = TimerSplit[1];
                NewFarmingLog.SetTimer(TimerType, TimerValue);
            }
            //Add this new farming log into the server info here
            this.FarmingLogs.push(NewFarmingLog);
        }
    }

    async UpdateSaveData()
    {
        //Figure out what the filename would be for this server backup file
        var FileName = (__dirname + '/../SaveFiles/' + this.ServerID + '.json');

        //Grab all the info we need to put into the save file
        var Songs = '';
        for(var i = 0; i < this.SongList.length; i++)
        {
            Songs += this.SongList[i];
            if(i < this.SongList.length - 1)
                Songs += ' ';
        }
        var Timers = '';
        for(var i = 0; i < this.FarmingLogs.length; i++)
        {
            var FarmingLog = this.FarmingLogs[i];
            var LogInfo = FarmingLog.UserID + '-';
            for(var j = 0; j < FarmingLog.CropTimers.length; j++)
            {
                var FarmingTimer = FarmingLog.CropTimers[j];
                var TimerInfo = (FarmingTimer.CropName + ':' + FarmingTimer.Timer);
                LogInfo += TimerInfo;
                if(j < FarmingLog.CropTimers.length - 1)
                    LogInfo += '-';
            }
            Timers += LogInfo;
            if(i < this.FarmingLogs.length - 1)
                Timers += ' ';
        }
        //structure this data properly so it can be saved in json file format
        var ServerData = {
            songs: Songs,
            logs: Timers
        };
        var SaveData = JSON.stringify(ServerData);
        FileSystem.writeFile(FileName, SaveData, 'utf8', this.BackupComplete);
        return;
    }

    //callback event when server back is complete
    BackupComplete()
    {
        console.log('server info backed up');
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
