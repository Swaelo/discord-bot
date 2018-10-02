const commando = require('discord.js-commando');

class ServerInfo extends commando.Command
{
    constructor(client)
    {
        super(client,{
            name: 'serverinfo',
            group: 'general',
            memberName: 'serverinfo',
            description: 'Displays information about this discord server'
        });
    }

    async run(message, args)
    {
        var server = message.guild;  //The current server being asked about

        message.channel.send({embed: {
            color: 3447003,
            title: '__**Server Info**__',
            fields:
                [{
                    name: "Name",
                    value: ('`' + server.name + '`')
                },
                {
                    name: "ID",
                    value: ('`' + server.id + '`')
                },
                {
                    name: "Region",
                    value: ('`' + server.region + '`')
                },
                {
                    name: "Owner",
                    value: ('`' + server.owner.user.username + '`')
                },
                {
                    name: "Creation Date",
                    value: ('`' + server.createdAt + '`')
                },
                {
                    name: "Member Count",
                    value: ('`' + server.memberCount + '`')
                }]
            }
        });

    }
}

module.exports = ServerInfo;
