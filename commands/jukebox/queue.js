const commando = require('discord.js-commando');

class Queue extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'queue',
            group: 'jukebox',
            memberName: 'queue',
            description: 'Displays the current list of songs in the queue.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxQueue(message, args);
    }
}

module.exports = Queue;
