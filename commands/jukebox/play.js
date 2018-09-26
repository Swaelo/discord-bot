const commando = require('discord.js-commando');

class Play extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'play',
            group: 'jukebox',
            memberName: 'play',
            description: 'Plays audio of the given youtube link in your voice channel.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxPlay(message, args);
    }
}

module.exports = Play;
