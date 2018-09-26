const command = require('discord.js-commando');
const YTDL = require('ytdl-core');
const Messages = require(__dirname + '/jukeboxMessages.json');
var miscFunctions = require('../../miscFunctions.js');
var validator = require('swaelos-youtube-validator');

class Jukebox
{
    constructor() {
        this.servers = {}
    }

    JukeboxJoin(message, args)
    {
        //Make sure the person who sent the command is connected to a voice channel
        if(!message.member.voiceChannel)
        {
            message.channel.send(Messages.ErrorUserNotInVoice);
            return;
        }

        //Now join the same channel as them
        message.member.voiceChannel.join()
            .then(message.channel.send(Messages.JoinedVoice))
            .catch(console.error);
    }

    JukeboxLeave(message, args)
    {
        //Check we are in a channel first or not
        if(!global.bot.voiceConnections.get(message.guild.id))
        {
            message.channel.send(Messages.ErrorBotNotInVoice);
            return;
        }

        //Now disconnect from it
        global.jukebox.servers[message.guild.id] = {queue: [], playing: false}
        global.bot.voiceConnections.get(message.guild.id).disconnect();
        message.channel.send(Messages.LeftVoice);
    }

    JukeboxPlay(message, args)
    {
        //Make a single string of the song that wants to be played
        var song = miscFunctions.combineArgs(args);

        //Make sure its a valid youtube link
        validator.validateURL(song, function(res, err)
        {
            if(err)
            {
                message.channel.send(Messages.ErrorURLValidationFailure);
                return;
            }
            else
            {//This url looks good, we should be able to play it

                //If we arent already in a voice channel, join with who requested the song
                if(!global.bot.voiceConnections.get(message.guild.id))
                    message.member.voiceChannel.join();

                //If we arent keeping track of a song list for this server, set one up
                if(!global.jukebox.servers[message.guild.id])
                    global.jukebox.servers[message.guild.id] = {queue: [], playing: false}

                var server = global.jukebox.servers[message.guild.id];

                //Push the new song onto the playlist
                server.queue.push(song);

                //If we are already playing a song right now, just let it continue
                if(server.playing)
                {
                    message.channel.send(Messages.AddedSong);
                    return;
                }

                //Otherwise if nothing is playing, just ask the next song to begin
                global.jukebox.PlaySong(song, server, message);
            }
        });
    }

    PlaySong(song, server, message)
    {
        //If there are no more songs to play then we are finished for now
        if(server.queue.length <= 0)
        {
            server.playing = false;
            message.channel.send(Messages.QueueFinish);
            return;
        }

        //Otherwise, start playing the next song immediately
        server.playing = true;
        message.channel.send(Messages.PlayingSong);
        var voiceConnection = global.bot.voiceConnections.get(message.guild.id);
        server.dispatcher = voiceConnection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
        server.queue.shift();
        //Setup a callback to return here when the song it finished so we can begin the next one
        server.dispatcher.on("end", function()
        {
            global.jukebox.PlaySong(song, server, message);
        });
    }

    JukeboxMove(message, args)
    {
        console.log("jukebox move");
    }

    JukeboxPause(message, args) {
        console.log("jukebox pause");
    }

    JukeboxSkip(message, args) {
        console.log("jukebox skip");
    }

    JukeboxRestart(message, args) {
        console.log("jukebox restart");
    }

    JukeboxQueue(message, args) {
        console.log("jukebox queue");
    }

    JukeboxShuffle(message, args) {
        console.log("jukebox shuffle");
    }

    JukeboxLyrics(message, args) {
        console.log("jukebox lyrics");
    }

    JukeboxRemove(message, args) {
        console.log("jukebox remove");
    }
}

module.exports.Jukebox = Jukebox;
