const commando = require('discord.js-commando');

class Shuffle extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'shuffle',
            group: 'jukebox',
            memberName: 'shuffle',
            description: 'Mixes up whatever songs are currently in the queue.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxShuffle(message, args);
    }
}

module.exports = Shuffle;
