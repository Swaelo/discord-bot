const commando = require('discord.js-commando');

class Stop extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'stop',
            group: 'jukebox',
            memberName: 'stop',
            description: 'Stops playing any music, stays in the voice channel.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxStop(message, args);
    }
}

module.exports = Stop;
