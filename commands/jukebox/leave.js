const commando = require('discord.js-commando');

class Leave extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'leave',
            group: 'jukebox',
            memberName: 'leave',
            description: 'Leaves whatever voice channel it is currently in.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxLeave(message, args);
    }
}

module.exports = Leave;
