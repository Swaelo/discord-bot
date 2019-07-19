//Tracks the time for an individual ports ship voyage
class VoyageTimer
{
    //Constructor that stores the arguments in the object
    constructor(UserID, ShipName, VoyageTime)
    {
        this.UserID = UserID;
        this.ShipName = ShipName;
        this.VoyageTime = VoyageTime;
        var date = new Date();
        this.Timer = date.getTime() + parseInt(this.VoyageTime);
    }

    //Ship Name getter
    GetShipName() { return this.ShipName; }
    //Timer value getter
    GetTimer() { return this.Timer; }

    //Sets the timer length to a new value and resets it
    Override(NewLength)
    {
        this.VoyageTime = NewLength;
        var date = new Date();
        this.Timer = date.getTime() + parseInt(this.VoyageTime);
    }

    //Resets the timer back to its set value
    ResetTimer() {
        var date = new Date();
        this.Timer = date.getTime() + parseInt(this.VoyageTime);
    }

    //Sets the timer to 0 value
    EndTimer() {
        this.Timer = 0;
    }
}

module.exports.VoyageTimer = VoyageTimer;