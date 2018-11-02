class Command
{
    constructor(Trigger)
    {
        //The trigger is what word in chat the users speak to trigger this command
        this.CommandTrigger = Trigger;
    }
}

module.exports.Command = Command;
