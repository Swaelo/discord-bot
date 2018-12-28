//Tracks the time for a individual type of crop
class CropTimer
{
  constructor(CropName, GrowthTime)
  {
    this.CropName = CropName;
    this.GrowthTime = GrowthTime;
    this.Timer = 0;
  }

  GetType() { return this.CropName; }
  GetTimer() { return this.Timer; }

  ResetTimer() {
    var date = new Date();
    this.Timer = date.getTime() + parseInt(this.GrowthTime);
  }

  EndTimer() {
    this.Timer = 0;
  }
}

module.exports.CropTimer = CropTimer;
