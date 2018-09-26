const commando = require('discord.js-commando');

class Shutdown extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'shutdown',
            group: 'general',
            memberName: 'shutdown',
            description: 'Forces the bot to disconnect from the server'
        });
    }

    async run(message, args)
    {
        message.channel.send("shutting down");
        global.bot.destroy();
    }
}

module.exports = Shutdown;
