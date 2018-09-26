const commando = require('discord.js-commando');

class Remove extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'remove',
            group: 'jukebox',
            memberName: 'remove',
            description: 'Removes from the queue whatever song matches the given name or youtube link.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxRemove(message, args);
    }
}

module.exports = Remove;
