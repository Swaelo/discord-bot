const discord = require('discord.js');
const commando = require('discord.js-commando');
var commandHelpers = require('../../commandHelpDescriptions.json');

class Help extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'help',
            group: 'jukebox',
            memberName: 'help',
            description: 'Provides information on correct function use.'
        });
    }

    async run(message, args)
    {
        if(!args)
            this.GeneralHelp(message);
        else
            this.SpecificHelp(message, args);
    }

    GeneralHelp(msg)
    {
        msg.channel.send({embed: {
            color: 3447003,
            title: '__**Command Help**__',
            fields:
                [{
                    name: "`*command`",
                    value: "Runs the command with that name"
                },
                {
                    name: "`*help <command>`",
                    value: "Provides detailed information about a specific command."
                },
                {
                    name: "`*help all`",
                    value: "Provides a list of all the available commands."
                }]
            }
        });
    }

    SpecificHelp(msg, args)
    {
        //Combine the arg back into a single word
        var totalArg = '';
        for(var i = 0; i < args.length; i++)
            totalArg += args[i];

        //Now give the information they are looking for
        switch(totalArg)
        {
            case 'all':
                this.DisplayCompleteCommandList(msg);
                return;
            case 'join':
                msg.channel.send(CreateEmbed('`*join`', commandHelpers.join));
                return;
            case 'leave':
                msg.channel.send(CreateEmbed('`*leave`', commandHelpers.leave));
                return;
            case 'lyrics':
                msg.channel.send(CreateEmbed('`*lyrics`', commandHelpers.lyrics));
                return;
            case 'pause':
                msg.channel.send(CreateEmbed('`*pause`', commandHelpers.pause));
                return;
            case 'play':
                msg.channel.send(CreateEmbed('`*play <songname>` or `*play <youtube link>`', commandHelpers.play));
                return;
            case 'queue':
                msg.channel.send(CreateEmbed('`*queue`', commandHelpers.queue));
                return;
            case 'remove':
                msg.channel.send(CreateEmbed('`*remove <songname>` or `*remove <youtube link>`', commandHelpers.remove));
                return;
            case 'restart':
                msg.channel.send(CreateEmbed('`*restart`', commandHelpers.restart));
                return;
            case 'shuffle':
                msg.channel.send(CreateEmbed('`*shuffle`', commandHelpers.shuffle));
                return;
            case 'skip':
                msg.channel.send(CreateEmbed('`*skip`', commandHelpers.skip));
                return;
        }

        msg.channel.send('Sorry, I dont know anything about a ' + totalArg + ' command.');
    }

    DisplayCompleteCommandList(msg)
    {
        msg.channel.send({embed: {
            color: 3447003,
            author: {
                name: 'Available Commands'
            },
            title: '__**Jukebox**__',
            fields: [{
                name: "Moving Voice Channels",
                value: "`*join *leave`"
            },
            {
                name: "Controlling Music Playback",
                value: "`*play *pause *restart`"
            },
            {
                name: "Music Queue Control",
                value: "`*queue *remove *shuffle *skip`"
            },
            {
                name: "Misc",
                value: "`*lyrics`"
            }]
        }});
    }
}

module.exports = Help;

function CreateEmbed(commandName, commandDescription)
{
    embed = new discord.RichEmbed();
    embed.setTitle(commandName)
    embed.setColor(0x00AE86),
    embed.setDescription(commandDescription);
    return embed;
}
