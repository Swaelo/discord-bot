const commando = require('discord.js-commando');

class Lyrics extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'lyrics',
            group: 'jukebox',
            memberName: 'lyrics',
            description: 'Prints out the lyrics for whatever song is currently playing.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxLyrics(message, args);
    }
}

module.exports = Lyrics;
