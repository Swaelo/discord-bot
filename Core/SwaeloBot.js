//discord.js library is used to interact with discord
const Discord = require('discord.js');
//File System is used to save and load extra information saved to the server
const FileSystem = require('fs');
//Bots needs an authentication token to connect with the discord API
//var Token = require(__dirname + '/../auth.json');
//We use the server info class to load and save files, track everyones farming timers etc
var ServerInfo = require(__dirname + '/ServerInfo.js');

class SwaeloBot
{
  constructor()
  {
      //Provide global access
      this.client = new Discord.Client();

      //define on connect event
      this.client.on('ready', () => {
          //notify the connection has been made
          console.log('discord connection established');
          //store a list of every server we have joined
          global.Servers = [];
          this.client.guilds.forEach((guild) => {
              console.log('joined server: ' + guild.name);
              //Store info about each server we are connected to
              var NewServerInfo = new ServerInfo.ServerInfo(guild);
              global.Servers.push(NewServerInfo);
          });

          //check farming timers every X milliseconds
          setInterval(() => {
              global.FarmingCommands.CheckAllTimers();
          }, 3000);
      });

      //define on message recieved event
      this.client.on('message', UserMessage => {
          global.CommandHandler.HandleCommand(UserMessage);
      });
  }

  Login()
  {
      this.client.login('NDg4NTU3MzM0Mzc3OTIyNTcw.XSDAWQ.vCSCBRIu-vdftdv0MkvZ6PycaXs')   //put your bots token here
      .then(console.log('connecting...'))
      .catch(console.error);
  }
}

module.exports.SwaeloBot = SwaeloBot;
