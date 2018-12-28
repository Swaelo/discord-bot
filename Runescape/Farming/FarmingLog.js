var CropTimer = require(__dirname + '/CropTimer.js');
var FarmingCrops = require(__dirname + '/FarmingCrops.json');

class FarmingLog
{
    constructor(DiscordUser)
    {
        //0 is passed in when backup files are loaded in to overide the class values
        this.User = DiscordUser == 0 ? 0 : DiscordUser;
        this.UserID = DiscordUser == 0 ? 0 : DiscordUser.id;
        //create a timer for each type of crop that exists
        this.CropTimers = [];
        for(var CropName in FarmingCrops)
        {
            var GrowTime = FarmingCrops[CropName].growthTime;
            var Timer = new CropTimer.CropTimer(CropName, GrowTime);
            this.CropTimers.push(Timer);
        }
    }

    //Finds the timer tracking whatever crop name its given
    GetTimer(CropName)
    {
        for(var i = 0; i < this.CropTimers.length; i++)
        {
            var CropTimer = this.CropTimers[i];
            if(CropTimer.GetType() == CropName)
                return CropTimer;
        }
    }

    //Prints to the console the status of all timers in this log
    DisplayTimers()
    {
        for(var i = 0; i < this.CropTimers.length; i++)
        {
            var CropTimer = this.CropTimers[i];
            console.log(CropTimer.CropName + ' timer value is ' + CropTimer.Timer);
        }
    }

    //Overrides the value of a timer we are tracking, used when backups are loaded on startup
    SetTimer(TimerType, TimerValue)
    {
        //Find the timer that is being set
        for(var i = 0; i < this.CropTimers.length; i++)
        {
            var CropTimer = this.CropTimers[i];
            if(CropTimer.GetType() == TimerType)
            {
                //When we find the one we are looking for, override its values
                CropTimer.Timer = TimerValue;
                return;
            }
        }
    }
}

module.exports.FarmingLog = FarmingLog;
