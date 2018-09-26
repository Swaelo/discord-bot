const commando = require('discord.js-commando');

class Restart extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'restart',
            group: 'jukebox',
            memberName: 'restart',
            description: 'Restarts the current song from the beginning.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxRestart(message, args);
    }
}

module.exports = Restart;
