class FarmingLog
{
  constructor(NewUser)
  {
    this.User = NewUser;
    this.UserID = NewUser.id;
    
    this.herb = 0;
    this.morchella = 0;
    this.grapevine = 0;
    this.barberry = 0;
    this.bloodwood = 0;
    this.coconut = 0;
    this.sweetcorn = 0;
  }
  
  //Places all the timer values into a nice array
  GetTimers()
  {
    var TimerArray = [];
    TimerArray.push(this.herb);
    TimerArray.push(this.morchella);
    TimerArray.push(this.grapevine);
    TimerArray.push(this.barberry);
    TimerArray.push(this.bloodwood);
    TimerArray.push(this.coconut);
    TimerArray.push(this.sweetcorn);
    return TimerArray;
  }
}

module.exports.FarmingLog = FarmingLog;