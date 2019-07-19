var CropTimer = require(__dirname + '/CropTimer.js');
var AnimalTimer = require(__dirname + '/AnimalTimer.js');
var VoyageTimer = require(__dirname + '/VoyageTimer.js');
var FarmingCrops = require(__dirname + '/FarmingCrops.json');
var FarmAnimals = require(__dirname + '/FarmAnimals.json');

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

        //create a timer for each type of farm animal that exists
        this.AnimalTimers = [];
        for(var AnimalName in FarmAnimals)
        {
            var AdolescentGrowTime = FarmAnimals[AnimalName].adolescentGrowthTime;
            var NewAnimalTimer = new AnimalTimer.AnimalTimer(AnimalName, AdolescentGrowTime);
            this.AnimalTimers.push(NewAnimalTimer);
        }

        //create a dictionary of voyage timers for the user
        this.VoyageTimers = {};
    }

    //Finds the farming crop timer tracker for whatever crop name is passed into the function
    GetCropTimer(CropName)
    {
        //Count how many crop types we are dealing with right now
        var CropCount = this.CropTimers.length;
        //Loop through each crop type that is currently available
        for(var CropIterator = 0; CropIterator < CropCount; CropIterator++)
        {
            //Check each crop timer as we go through the array
            var CurrentCropTimer = this.CropTimers[CropIterator];
            //Return this timer if it matches the type that has been asked for
            if(CurrentCropTimer.GetType() == CropName)
                return CurrentCropTimer;
        }
    }

    //Finds the POH animal growth timer tracker for whatever animal type is passed into the function
    GetAnimalTimer(AnimalName)
    {
        //Count how many animal types we are dealing with right now
        var AnimalCount = this.AnimalTimers.length;
        //Loop through each animal type that is currently available
        for(var AnimalIterator = 0; AnimalIterator < AnimalCount; AnimalIterator++)
        {
            //Check each animal timer as we go through the array
            var CurrentAnimalTimer = this.AnimalTimers[AnimalIterator];
            //Return this timer if it matches the type that we are searching for
            if(CurrentAnimalTimer.GetType() == AnimalName)
                return CurrentAnimalTimer;
        }
    }

    //Finds the voyage timer tracker for the boat of the given name
    GetVoyageTimer(UserID, BoatName, Milliseconds)
    {
        //Check if a voyage timer exists for the given boat name
        var TimerExists = BoatName in this.VoyageTimers;

        //Return the timer if it already exists
        if(TimerExists)
            return this.VoyageTimers[BoatName];

        //Otherwise create a new timer, store it in the dictionary and return it
        var NewTimer = new VoyageTimer.VoyageTimer(UserID, BoatName, Milliseconds);
        this.VoyageTimers[BoatName] = NewTimer;
        return NewTimer;
    }

    //Overrides the value of a crop timer that we are currently tracking, used by ServerInfo class as it auto loads old save data
    //from file when the bot is awoken
    SetCropTimer(CropType, TimerValue)
    {
        //Loop through all the crop timers we are currently keeping track of and find the one which we want to override
        var CropTimerCount = this.CropTimers.length;
        for(var CropTimerIterator = 0; CropTimerIterator < CropTimerCount; CropTimerIterator++)
        {
            //Get the info of the current crop timer in the list that we are looking at as we loop through all of them
            var CurrentCropTimer = this.CropTimers[CropTimerIterator];
            //Check to see if this current timer is the one that we are trying to override the values for
            if(CurrentCropTimer.GetType() == CropType)
            {
                //We have found the timer we are trying to override, now set its value to the desired amount and finish
                CurrentCropTimer.Timer = TimerValue;
                return;
            }
        }
    }

    //Overrides the value of a animal timer that we are currently tracking
    SetAnimalTimer(AnimalType, TimerValue)
    {
        var AnimalTimerCount = this.AnimalTimers.length;
        for(var AnimalTimerIterator = 0; AnimalTimerIterator < AnimalTimerCount; AnimalTimerIterator++)
        {
            var CurrentAnimalTimer = this.AnimalTimers[AnimalTimerIterator];
            if(CurrentAnimalTimer.GetType() == AnimalType)
            {
                CurrentAnimalTimer.Timer = TimerValue;
                return;
            }
        }
    }

    //Overrides the value of a voyage timer that we are currently tracking
    SetVoyageTimer(BoatName, TimerValue)
    {
        //Check if a voyage timer exists for the given boat name already
        var TimerExists = BoatName in this.VoyageTimers;
        //Return the timer if it already exists
        if(TimerExists)
        {
            this.VoyageTimers[BoatName].Override(TimerValue);
            return this.VoyageTimers[BoatName];
        }

        //Otherwise create a new timer to track this voyage and store it with the rest
        var NewTimer = new VoyageTimer.VoyageTimer(BoatName, TimerValue);
        this.VoyageTimers[BoatName] = NewTimer;

        //Finish by returning the new voyage timer that was created
        return NewTimer;
    }
}

module.exports.FarmingLog = FarmingLog;
