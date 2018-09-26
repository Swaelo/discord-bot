//Load the librarys we need
const Commando = require('discord.js-commando');

//Start the bot
const bot = new Commando.Client({
    commandPrefix: '*'
});

//Import each group of functions one at a time
var jukebox = require(__dirname + "/jukebox.js")
global.jukebox = new jukebox.Jukebox();
AddCommands(bot, 'jukebox', 'Jukebox', __dirname + "/commands");

//Connect the bot to the server
var config = require('./package.json');
bot.login(config.token);

//Registers a group of commands together
function AddCommands(BotClient, GroupID, GroupName, CommandDirectory)
{
    BotClient.registry.registerGroup(GroupID, GroupName);
    BotClient.registry.registerCommandsIn(CommandDirectory);
}

// //Import required librarys
// const commando = require('discord.js-commando');
// const YTDL = require('ytdl-core');
//
// //Class definition for !play <youtube> functionality
// class JoinChannelCommand extends commando.Command
// {
//     //Set up command description and activation keyword
//     constructor(client)
//     {
//         super(client,{
//             name: 'play',
//             group: 'jukebox',
//             memberName: 'play',
//             description: 'connects me to whatever voice channel you are currently in'
//         });
//     }
//
//     //This function will be called when a user calls the !play function in chat
//     async run(message, args)
//     {
//         //The user must be in a voice channel for us to play a song for them
//         if(message.member.voiceChannel)
//         {
//             //Not really sure what guilds are, need to look into this to understand what is happening here
//             if(!message.guild.voiceChannel)
//             {
//                 if(!servers[message.guild.id])
//                 {
//                     servers[message.guild.id] = {queue: []}
//                 }
//                 //Join the voice channel with the user who asked for a song to be played
//                 message.member.voiceChannel.join()
//                     .then(connection =>
//                     {
//                         //Once connected, check which server we are in
//                         var server = servers[message.guild.id];
//                         //Tell the user we have joined the voice channel with them
//                         message.reply('joined your voice channel');
//                         //Push the newly requested song into the playlist
//                         server.queue.push(args);
//                         //Start playing the new song
//                         Play(connection, message);
//                     });
//             }
//         }
//         else {
//             //If the user isnt in a voice channel let them know to do that first
//             message.reply('join a voice channel first, then ask me again');
//         }
//     }
// }
//
// //This function
// function Play(connection, message)
// {
//     var server = servers[message.guild.id];
//     server.dipatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
//     server.queue.shift();
//     server.dipatcher.on("end", function()
//     {
//         if(server.queue[0])
//         {
//             player(connection,message);
//         }
//         else {
//             connection.disconnect();
//         }
//     });
// }
//
// module.exports = JoinChannelCommand;
