const command = require('discord.js-commando');
const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const Messages = require(__dirname + '/jukeboxMessages.json');
var miscFunctions = require('../../miscFunctions.js');
var validator = require('swaelos-youtube-validator');
var jukeboxServerInfo = require(__dirname + '/jukeboxServerInfo.js');

class Jukebox
{
    constructor()
    {
        this.servers = {}
        this.jukeboxServers = [];
    }

    JukeboxJoin(message, args)
    {
        //Find the relevant server information
        var server = this.FindServerByID(message.guild.id);

        //Make sure the person who sent the command is connected to a voice channel
        if(!message.member.voiceChannel)
        {
            message.channel.send(Messages.ErrorUserNotInVoice);
            return;
        }

        //Reject the users request if we are already connected to the same voice channel as they are
        if((server.inVoice == true) && (server.voiceChannel == message.member.voiceChannel))
        {
            message.channel.send(Messages.ErrorInYourVoiceAlready);
            return;
        }

        //Attempt to join the users voice channel
        message.member.voiceChannel.join()
            .then(function() {
                //Join success
                message.channel.send(Messages.JoinedVoice);
                server.inVoice = true;
                server.voiceChannel = message.member.voiceChannel;
                server.voiceConnection = global.bot.voiceConnections.get(message.guild.id);
            }).catch(function() {
                //Join fail
                message.channel.send(Messages.ErrorCouldntJoinVoice);
                server.inVoice = true;
            });
    }

    JukeboxLeave(message, args)
    {
        //Find the relevant server information
        var server = this.FindServerByID(message.guild.id);

        //Reject the request if we arent connected to a voice channel
        if(server.inVoice == false)
        {
            message.channel.send(Messages.ErrorBotNotInVoice);
            return;
        }

        //Disconnect from the voice channel, and reset the song list
        server.inVoice = false;
        server.playingMusic = false;
        server.songList = [];
        server.voiceConnection.disconnect();
        message.channel.send(Messages.LeftVoice);
    }

    JukeboxPlay(message, args)
    {
        //Find the relevant server information
        var server = this.FindServerByID(message.guild.id);
        //Combine users song request into a single string
        var song = miscFunctions.combineArgs(args);

        //Perform some nessacery checks before we play the song
        //Make sure the bot is connected to a voice channel
        if(!this.BotInVoice(message))
            return;
        //Make sure the user who sent the request is in a voice channel
        if(!this.UserInVoice(message))
            return;
        //Make sure we are connected to the same voice channel as the user who sent the request
        if(!this.UserBotInVoice(message))
            return;
        //Make sure the link sent by the user is valid
        validator.validateURL(song, function(res, err)
        {
            if(err)
            {
                message.channel.send(Messages.ErrorURLValidationFailure);
                return;
            }
        });

        //All checks have passed successfully, lets add the song to the list
        server.songList.push(song);

        //If we are already playing a song, say that the new song has been added to the end of the list
        if(server.playingMusic == true)
        {
            this.AddedToList(message);
            return;
        }

        //Otherwise, begin playback of this new song immediately
        this.PlaySong(song, message);
    }

    JukeboxSkip(message, args)
    {
        //Get relevant server info
        var server = this.FindServerByID(message.guild.id);

        //reject request if any of the following tests fail
        if(!this.BotInVoice(message))//The bot is not connected to a voice channel
            return;
        if(!this.UserInVoice(message))//The user who sent the request is not in a voice channel
            return;
        if(!this.UserBotInVoice(message))//The bot and the user are not connected to the same voice channel
            return;
        if(this.SongListEmpty(message))//The song list is empty so there is nothing left to play
            return;

        //All tests have passed, now we can stop the current song, which should trigger the callback to start the next song automatically
        server.dispatcher.end();
    }

    JukeboxRestart(message, args)
    {
        //Get relevant server info
        var server = this.FindServerByID(message.guild.id);

        //reject request if any of the following tests fail
        if(!this.BotInVoice(message))//The bot is not connected to a voice channel
            return;
        if(!this.UserInVoice(message))//The user who sent the request is not in a voice channel
            return;
        if(!this.UserBotInVoice(message))//The bot and the user are not connected to the same voice channel
            return;

        //All tests have passed, now we can restart the current song
        //We can do this simply by pushing the current song back onto the front of the list and stopping the current song
        //Then the callback should trigger to start the next song, which will be the same one that was already playing
        server.songList.unshift(server.currentSongLink);
        server.dispatcher.end();
    }

    JukeboxStop(message, args)
    {
        var server = this.FindServerByID(message.guild.id);

        //Check for any reason to reject this request
        if(!this.BotInVoice(message))
            return;
        if(!this.UserInVoice(message))
            return;
        if(!this.UserBotInVoice)
            return;
        if(!server.playingMusic)
        {
            message.channel.send(Messages.ErrorNothingToStop);
            return;
        }

        //Not we can stop playing the current song and clear out the song list
        server.playingMusic = false;
        server.songList = [];
        server.dispatcher.end();
        message.channel.send(Messages.MusicStopped);
    }

    JukeboxList(message, args)
    {
        //Reject the request if the list is currently empty
        if(this.SongListEmpty(message))
        {
            message.channel.send(Messages.ErrorDisplayEmptyQueue);
            return;
        }

        //Otherwise, find the info we need and display that
        this.DisplaySongList(message);
    }

    JukeboxPause(message, args)
    {
        var server = this.FindServerByID(message.guild.id);

        //Check for any reason to reject this request
        if(!this.BotInVoice(message))
            return;
        if(!this.UserInVoice(message))
            return;
        if(!this.UserBotInVoice)
            return;
        if(!server.playingMusic)
        {
            message.channel.send(Messages.ErrorNothingToPause);
            return;
        }
        if(server.musicPaused)
        {
            message.channel.send(Messages.ErrorAlreadyPaused);
            return;
        }

        //Now we can pause the song
        server.musicPaused = true;
        server.dispatcher.pause();
        message.channel.send(Messages.SongPaused);
    }

    JukeboxResume(message, args)
    {
        var server = this.FindServerByID(message.guild.id);

        if(!this.BotInVoice(message))
            return;
        if(!this.UserInVoice(message))
            return;
        if(!this.UserBotInVoice)
            return;
        if(!server.playingMusic)
        {
            message.channel.send(Messages.ErrorNothingToResume);
            return;
        }
        if(server.musicPaused == false)
        {
            message.channel.send(Messages.ErrorNotPaused);
            return;
        }

        //Now we can resume the song
        server.musicPaused = false;
        server.dispatcher.resume();
        message.channel.send(Messages.SongResumed);
    }



    async AddedToList(message)
    {
        var server = this.FindServerByID(message.guild.id);
        var msg = await message.channel.send('Fetching song information...');
        var info = await YTDL.getInfo(server.currentSongLink);
        msg.edit(info.title + Messages.AddedSong);
    }

    async NewSongTitle(message)
    {
        var server = this.FindServerByID(message.guild.id);
        var msg = await message.channel.send('Fetching song information...');
        var info = await YTDL.getInfo(server.currentSongLink);
        msg.edit(Messages.NowPlaying + info.title);
    }

    async DisplaySongList(message)
    {
        var server = this.FindServerByID(message.guild.id);
        var list = 'Song List\n';
        var msg = await message.channel.send('Fetching song list...');
        for(var i = 0; i < server.songList.length; i++)
        {
            const info = await YTDL.getInfo(server.songList[i]);
            list += ('#' + (i+1) + ': ' + info.title + '\n');
        }
        msg.edit(list);
    }

    AddServer(server)
    {
        var serverInfo = new jukeboxServerInfo.JukeboxServerInfo(server);
        this.jukeboxServers.push(serverInfo);
    }

    FindServerByID(serverID)
    {
        for(var i = 0; i < this.jukeboxServers.length; i++)
        {
            if(this.jukeboxServers[i].serverID == serverID)
                return this.jukeboxServers[i];
        }
        console.log("couldnt find any server with id " + serverID);
    }

    PlaySong(song, message)
    {
        //Get relevant server info
        var server = this.FindServerByID(message.guild.id);

        //If there arent any songs left in the list, then finish up playing music for now
        if(server.songList.length <= 0)
        {
            server.playingMusic = false;
            return;
        }

        //If there are still songs to be played, start the next song in the list
        server.playingMusic = true;
        server.dispatcher = server.voiceConnection.playStream(YTDL(server.songList[0], {filter: "audioonly"}));

        //Update the lists containing song links and titles
        server.currentSongLink = server.songList[0];
        //shift the songs off the front of the lists
        server.songList.shift();

        //send a message to chat telling the title of the new song that is now going to be played
        this.NewSongTitle(message);

        //Create a callback to this function so the next song will be played when the current song is finished
        server.dispatcher.on("end", function()
        {
            global.jukebox.PlaySong(server.songList[0], message);
        });
    }

    BotInVoice(message)
    {
        var server = this.FindServerByID(message.guild.id);
        if(!server.inVoice)
            message.channel.send(Messages.ErrorBotNotInVoice);
        return server.inVoice;
    }

    UserInVoice(message)
    {
        if(!message.member.voiceChannel)
        {
            message.channel.send(Messages.ErrorUserNotInVoice);
            return false;
        }
        return true;
    }

    UserBotInVoice(message)
    {
        var server = this.FindServerByID(message.guild.id);
        if(server.voiceChannel != message.member.voiceChannel)
            message.channel.send(Messages.ErrorDifferentVoiceChannel);
        return (server.voiceChannel == message.member.voiceChannel);
    }

    SongListEmpty(message)
    {
        var server = this.FindServerByID(message.guild.id);
        return (server.songList.length <= 0);
    }
}

module.exports.Jukebox = Jukebox;
