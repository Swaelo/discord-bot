const commando = require('discord.js-commando');

class Join extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'join',
            group: 'jukebox',
            memberName: 'join',
            description: 'Joins whatever voice channel you are currently in.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxJoin(message, args);
    }
}

module.exports = Join;
