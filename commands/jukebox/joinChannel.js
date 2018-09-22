const commando = require('discord.js-commando');
const YTDL = require('ytdl-core');

function Play(connection, message)
{
    var server = servers[message.guild.id];
    server.dipatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dipatcher.on("end", function()
    {
        if(server.queue[0])
        {
            player(connection,message);
        }
        else {
            connection.disconnect();
        }
    });
}

class JoinChannelCommand extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'play',
            group: 'jukebox',
            memberName: 'play',
            description: 'connects me to whatever voice channel you are currently in'
        });
    }

    async run(message, args)
    {
        if(message.member.voiceChannel)
        {
            if(!message.guild.voiceChannel)
            {
                if(!servers[message.guild.id])
                {
                    servers[message.guild.id] = {queue: []}
                }
                message.member.voiceChannel.join()
                    .then(connection =>
                    {
                        var server = servers[message.guild.id];
                        message.reply('joined your voice channel');
                        server.queue.push(args);
                        Play(connection, message);
                    });
            }
        }
        else {
            message.reply('join a voice channel first, then ask me again');
        }
    }
}

module.exports = JoinChannelCommand;
