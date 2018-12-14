//discord.js library is used to interact with discord
const Discord = require('discord.js');

class SwaeloBot
{
  constructor()
  {
    this.client = new Discord.Client();
    
    //on connection callback
    this.client.on('ready', () => {
      console.log('swaelo bot loaded');
      
      //every 30 seconds, check if any farming timers have completed
      setInterval(() => {
        global.FarmingCommands.CheckCropTimers();
      }, 5000);  
    });
    
    //on message input callback
    this.client.on('message', UserMessage => {
      global.CommandHandler.HandleCommand(UserMessage);
    });
    
  }
  
  Login()
  {
   this.client.login(process.env.TESTTOKEN)
    .then(console.log('bot connected'))
    .catch(console.error);
  }
  
}

module.exports.SwaeloBot = SwaeloBot;