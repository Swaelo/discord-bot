const commando = require('discord.js-commando');

class List extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'list',
            group: 'jukebox',
            memberName: 'list',
            description: 'Displays the current list of songs in the queue.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxList(message, args);
    }
}

module.exports = List;
