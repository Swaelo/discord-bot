const commando = require('discord.js-commando');

class Pause extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'pause',
            group: 'jukebox',
            memberName: 'pause',
            description: 'Pauses whatever song is currently being played.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxPause(message, args);
    }
}

module.exports = Pause;
