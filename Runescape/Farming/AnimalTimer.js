//Tracks the time for a individual type of crop
class AnimalTimer
{
  constructor(AnimalName, GrowthTime)
  {
    this.AnimalName = AnimalName;
    this.GrowthTime = GrowthTime;
    this.Timer = 0;
  }

  GetType() { return this.AnimalName; }
  GetTimer() { return this.Timer; }

  ResetTimer() {
    var date = new Date();
    this.Timer = date.getTime() + parseInt(this.GrowthTime);
  }

  EndTimer() {
    this.Timer = 0;
  }
}

module.exports.AnimalTimer = AnimalTimer;
