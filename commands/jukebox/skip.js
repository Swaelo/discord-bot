const commando = require('discord.js-commando');

class Skip extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'skip',
            group: 'jukebox',
            memberName: 'skip',
            description: 'Skips to the next song in the queue.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxSkip(message, args);
    }
}

module.exports = Skip;
