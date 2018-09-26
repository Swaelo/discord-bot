const commando = require('discord.js-commando');

class Move extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'move',
            group: 'jukebox',
            memberName: 'move',
            description: 'Moves me into whatever voice channel you are in.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxMove(message, args);
    }
}

module.exports = Move;
