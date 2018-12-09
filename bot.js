const Discord = require('discord.js');
var auth = require(__dirname + '/auth.json');

class Bot
{
    constructor()
    {
        //Create a client user for the bot to interact with
        this.client = new Discord.Client();

        //Note when we connect to a new server
        this.client.on('ready', () => {
            console.log('connected to a server');

            setInterval(() =>
            {
                //Every 10 seconds have the farming reminder class check if any timers are ready now
                global.FarmingReminder.CheckTimers();
            }, 10000);
        });

        //Read all messages sent to the text chat in anticipation of user commands
        this.client.on('message', msg => {

            //hard debug checks go here
            if(msg.content == '*nick')
                this.client.user.setUsername('swaelo 0.21').catch(console.error);
            //Pass commands onto the command handler class
            global.CommandHandler.HandleCommand(msg);
        });
    }

    GetClient()
    {
        return this.client;
    }

    //Connects the bot to all of its servers
    Login()
    {
        this.client.login(auth.BotToken)
            .then(console.log('bot logged in'))
            .catch(console.error);
    }
}

module.exports.Bot = Bot;
