var CommandClass = require(__dirname + '/../Command.js');
var RunescapeErrorMessages = require(__dirname + '/RunescapeErrorMessages.json');
var FarmingMessages = require(__dirname + '/farmingReminderMessages.json');
var FarmingReminderTypes = require(__dirname + '/farmingReminderTypes.json');

const fs = require('fs');
const log = ('ReminderLogFile.txt');

class FarmingReminderCommand extends CommandClass.Command
{
    constructor()
    {
        super('reminder');
        this.CommandCallback = this.Execute;

        //Create member variables for each reminder type available
        global.CornTimer = -1;
        global.CornTimer = -1;
        global.HerbTimer = -1;
        global.GrapeTimer = -1;
        global.BushTimer = -1;
        global.MushroomTimer = -1;
        global.BloodwoodTimer = -1;
        global.MagicTimer = -1;
        global.PalmTimer = -1;
    }

    LoadLogFile()
    {
        try {
            //Check if a reminder log file already exists
            if(fs.existsSync(log))
            {
                //Load the already existing file if we found one
                fs.readFile(log, function(err, buf) {
                    //Load all the data from the file
                    var FileContext = buf.toString();
                    //We assume its formatted correctly, split apart each line
                    var FileLines = FileContext.split('\n');

                    //Save time data for each reminder type into this class variables
                    for(var i = 0; i < FileLines.length; i++)
                    {
                        //Split each line from type name and timer counter
                        var LineSplit = FileLines[i].split(' ');
                        var ReminderType = LineSplit[0];
                        var Timer = LineSplit[1];
                        //Save each reminder type into the correct class member variable
                        switch(ReminderType)
                        {
                            case 'corn':
                                global.CornTimer = Timer;
                                break;
                            case 'herb':
                                global.HerbTimer = Timer;
                                break;
                            case 'grape':
                                global.GrapeTimer = Timer;
                                break;
                            case 'bush':
                                global.BushTimer = Timer;
                                break;
                            case 'mushroom':
                                global.MushroomTimer = Timer;
                                break;
                            case 'bloodwood':
                                global.BloodwoodTimer = Timer;
                                break;
                            case 'magic':
                                global.MagicTimer = Timer;
                                break;
                            case 'palm':
                                global.PalmTimer = Timer;
                                break;
                        }
                    }
                });
            }
            //If there was no log file found, create a new one with empty data
            else
            {
                console.log('no reminder log file found, creating a new one.');
                var FileData = 'corn 0\nherb 0\ngrape 0\nbush 0\nmushroom 0\nbloodwood 0\nmagic 0\npalm 0';
                fs.writeFile(log, FileData, function(err, FileData){
                    if (err) console.log(err);
                    console.log('new reminder log file created/');
                });
            }
        } catch(err) {
            console.error(err);
        }
    }

    Execute(msg)
    {
        //Take the string sent from the user, change all characters to lower case
        var UserInput = msg.content.toLowerCase();

        //Split the string with spaces so we can seperate the command name and arguments apart
        var UserInputSplit = UserInput.split(' ');

        //If the split resulted in only a single object the command was not used correctly
        if(UserInputSplit.length < 2)
        {
            msg.channel.send(RunescapeErrorMessages.NotEnoughArguments);
            return;
        }
        if(UserInputSplit.length > 2)
        {
            msg.channel.send(RunescapeErrorMessages.TooManyArguments);
            return;
        }

        //Remove the command call object as we already know we are doing an invention command
        UserInputSplit.shift();

        //Now with the single argument left, we can see what type of reminder was to be set
        var ReminderType = UserInputSplit[0];

        //Check against all the keys in the json list to check if we can set reminds for this requested ReminderType
        if(!FarmingReminderTypes.hasOwnProperty(ReminderType))
        {
            msg.channel.send(RunescapeErrorMessages.UnknownReminderType);
            return;
        }

        //Check what the current time is
        var Clock = new Date();
        var CurrentTime = parseInt(Clock.getTime());

        //Find the right reminder type and update its value now
        switch(ReminderType)
        {
            case 'corn':
                //Check what the current timer for this type is at
                var CurrentTimer = parseInt(global.CornTimer);
                //If the timer is zero, set the new timer
                //Otherwise, just print the time this finishes
                if(CurrentTimer == 0)
                {
                    //Read the amount of milliseconds it takes to grow this type from the json file
                    var CornGrowthTime = parseInt(FarmingReminderTypes.corn);
                    //Add this to the current time to find out when it will be completed
                    var CornReadyTime = CurrentTime + CornGrowthTime;
                    //Update our tracker to remember when this timer is going to be completed
                    global.CornTimer = CornReadyTime;
                    //Finish by telling the user the timer has been set and when to expect the reminder
                    msg.channel.send(FarmingMessages.NewCornTimer);
                    //Remember who sent this timer question so we can PM them when its complete
                    global.CornReminder = msg.author;
                }
                else
                {
                    //If the timer is not completed yet, figure out how long until it is and display that information
                    var ReadyTime = parseInt(global.CornTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The corn hasnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'herb':
                var CurrentHerbTimer = parseInt(global.HerbTimer);
                if(CurrentHerbTimer == 0)
                {
                    var HerbGrowthTime = parseInt(FarmingReminderTypes.herb);
                    var HerbReadyTime = CurrentTime + HerbGrowthTime;
                    global.HerbTimer = HerbReadyTime;
                    msg.channel.send(FarmingMessages.NewHerbTimer);
                    global.HerbReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.HerbTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The herbs havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'grape':
                var CurrentGrapeTimer = parseInt(global.GrapeTimer);
                if(CurrentGrapeTimer == 0)
                {
                    var GrapeGrowthTime = parseInt(FarmingReminderTypes.grape);
                    var GrapeReadyTime = CurrentTime + GrapeGrowthTime;
                    global.GrapeTimer = GrapeReadyTime;
                    msg.channel.send(FarmingMessages.NewGrapeTimer);
                    global.GrapeReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.GrapeTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The grapes havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'bush':
                var CurrentBushTimer = parseInt(global.BushTimer);
                if(CurrentBushTimer == 0)
                {
                    var BushGrowthTime = parseInt(FarmingReminderTypes.bush);
                    var BushReadyTime = CurrentTime + BushGrowthTime;
                    global.BushTimer = BushReadyTime;
                    msg.channel.send(FarmingMessages.NewBushTimer);
                    global.BushReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.BushTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The bush hasnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'mushroom':
                var CurrentMushroomTimer = parseInt(global.MushroomTimer);
                if(CurrentMushroomTimer == 0)
                {
                    var MushroomGrowthTime = parseInt(FarmingReminderTypes.mushroom);
                    var MushroomReadyTime = CurrentTime + MushroomGrowthTime;
                    global.MushroomTimer = MushroomReadyTime;
                    msg.channel.send(FarmingMessages.NewMushroomTimer);
                    global.MushroomReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.MushroomTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The mushroom havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'bloodwood':
                var CurrentBloodTimer = parseInt(global.BloodwoodTimer);
                if(CurrentBloodTimer == 0)
                {
                    var BloodwoodGrowthTime = parseInt(FarmingReminderTypes.bloodwood);
                    var BloodwoodReadyTime = CurrentTime + BloodwoodGrowthTime;
                    global.BloodwoodTimer = BloodwoodReadyTime;
                    msg.channel.send(FarmingMessages.NewBloodwoodTimer);
                    global.BloodwoodReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.BloodwoodTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The bloodwood trees havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'magic':
                var CurrentMagicTimer = parseInt(global.MagicTimer);
                if(CurrentMagicTimer == 0)
                {
                    var MagicGrowthTime = parseInt(FarmingReminderTypes.magic);
                    var MagicReadyTime = CurrentTime + MagicGrowthTime;
                    global.MagicTimer = MagicReadyTime;
                    msg.channel.send(FarmingMessages.NewMagicTimer);
                    global.MagicReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.MagicTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The magic trees havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;

            case 'palm':
                var CurrentPalmTimer = parseInt(global.PalmTimer);
                if(CurrentPalmTimer == 0)
                {
                    var PalmGrowthTime = parseInt(FarmingReminderTypes.palm);
                    var PalmReadyTime = CurrentTime + PalmGrowthTime;
                    global.PalmTimer = PalmReadyTime;
                    msg.channel.send(FarmingMessages.NewPalmTimer);
                    global.PalmReminder = msg.author;
                }
                else {
                    var ReadyTime = parseInt(global.PalmTimer);
                    var ReadyIn = (ReadyTime - CurrentTime) / 1000;
                    msg.channel.send('The palm trees havnt finished growing yet');
                    this.DisplayTimeRemaining(ReadyIn, msg);
                }
                break;
        }
    }

    CheckTimers()
    {
        //Check what the current time is
        var Clock = new Date();
        var CurrentTime = parseInt(Clock.getTime());

        //Corn Timer
        var CornCompletionTime = parseInt(global.CornTimer);
        //Ignore 0 timers
        if(CornCompletionTime != 0)
        {
            //Figure out how long until this timer is complete
            var TimeUntilCompletion = CornCompletionTime - CurrentTime;
            //Check if its already completed
            if(TimeUntilCompletion <= 0)
            {
                //PM the person who started this timer telling them its completed now
                global.CornReminder.sendMessage('Your corn is ready for harvest!');
                //Reset this timer to zero
                global.CornTimer = 0;
            }
        }

        //Herb Timer
        var HerbCompletionTime = parseInt(global.HerbTimer);
        if(HerbCompletionTime != 0)
        {
            var TimeUntilCompletion = HerbCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.HerbReminder.sendMessage('Your herbs are ready for harvest!');
                global.HerbTimer = 0;
            }
        }

        //Grape Timer
        var GrapeCompletionTime = parseInt(global.GrapeTimer);
        if(GrapeCompletionTime != 0)
        {
            var TimeUntilCompletion = GrapeCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.GrapeReminder.sendMessage('Your Grapes are ready for harvest!');
                global.GrapeTimer = 0;
            }
        }

        //Bush Timer
        var BushCompletionTime = parseInt(global.BushTimer);
        if(BushCompletionTime != 0)
        {
            var TimeUntilCompletion = BushCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.BushReminder.sendMessage('Your Bushs are ready for harvest!');
                global.BushTimer = 0;
            }
        }

        //Mushroom Timer
        var MushroomCompletionTime = parseInt(global.MushroomTimer);
        if(MushroomCompletionTime != 0)
        {
            var TimeUntilCompletion = MushroomCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.MushroomReminder.sendMessage('Your Mushrooms are ready for harvest!');
                global.MushroomTimer = 0;
            }
        }

        //Bloodwood Timer
        var BloodwoodCompletionTime = parseInt(global.BloodwoodTimer);
        if(BloodwoodCompletionTime != 0)
        {
            var TimeUntilCompletion = BloodwoodCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.BloodwoodReminder.sendMessage('Your Bloodwoods are ready for harvest!');
                global.BloodwoodTimer = 0;
            }
        }

        //Magic Tree Timer
        var MagicCompletionTime = parseInt(global.MagicTimer);
        if(MagicCompletionTime != 0)
        {
            var TimeUntilCompletion = MagicCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.MagicReminder.sendMessage('Your Magics are ready for harvest!');
                global.MagicTimer = 0;
            }
        }

        //Palm Tree Timer
        var PalmCompletionTime = parseInt(global.PalmTimer);
        if(PalmCompletionTime != 0)
        {
            var TimeUntilCompletion = PalmCompletionTime - CurrentTime;
            if(TimeUntilCompletion <= 0)
            {
                global.PalmReminder.sendMessage('Your Palms are ready for harvest!');
                global.PalmTimer = 0;
            }
        }

    }

    DisplayTimeRemaining(SecondsRemaining, msg)
    {
        var TotalSeconds = Math.floor(SecondsRemaining);
        var TotalMinutes = Math.floor(SecondsRemaining / 60);
        TotalSeconds -= Math.floor(TotalMinutes * 60);
        var TotalHours = Math.floor(TotalMinutes / 60);
        TotalMinutes -= Math.floor(TotalHours * 60);

        msg.channel.send('This timer will complete in ' + TotalHours + ' hours, ' + TotalMinutes + ' minutes and ' + TotalSeconds + ' seconds time.');
    }
}

module.exports.FarmingReminderCommand = FarmingReminderCommand;
