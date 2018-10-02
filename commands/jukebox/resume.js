const commando = require('discord.js-commando');

class Resume extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'resume',
            group: 'jukebox',
            memberName: 'resume',
            description: 'Un-pauses whatever song is currently paused.'
        });
    }

    async run(message, args)
    {
        global.jukebox.JukeboxResume(message, args);
    }
}

module.exports = Resume;
