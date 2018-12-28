class Command
{
  constructor(Trigger)
  {
    this.CommandTrigger = Trigger;
  }

  //Reformats all the left over arguments back into a single string, with a space between each entry
  FormatArgs(args)
  {
      var FormattedArgs = '';
      for(var i = 0; i < args.length; i++)
      {
        //concatenate
        FormattedArgs += args[i];
        if(i < args.length -1)
          FormattedArgs += ' ';
      }
      return FormattedArgs;
  }
}

module.exports.Command = Command;
