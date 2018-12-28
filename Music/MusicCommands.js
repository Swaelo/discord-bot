var Command = require(__dirname + '/../Core/Command.js');
const YTDL = require('ytdl-core');

class MusicCommands extends Command.Command
{
  constructor()
  {
      super('music');
      this.CommandCallback = this.Execute;
      global.MusicPlayer = this;
  }

  Execute(UserMessage)
  {
    //process input
    var InputLower = UserMessage.content.toLowerCase();
    var InputSplit = InputLower.split(' ');
    //if after the split there is only one object, the command input is invalid
    if(InputSplit.length == 1)
    {
      UserMessage.channel.send(ErrorMessages.NoCommandSelected);
      return;
    }
    //continue processing input
    InputSplit.shift();

    //check invention sub command
    var InventionSubCommand = InputSplit[0];
    InputSplit.shift();

    //reformat the leftover args
    var Arguments = this.FormatArgs(InputSplit);

    //execute invention sub command
    switch(InventionSubCommand)
    {
      case 'join':
        this.JoinChannel(UserMessage, Arguments);
        return;
      case 'leave':
        this.LeaveChannel(UserMessage);
        return;
    case 'play':
        this.PlaySong(UserMessage, Arguments);
        return;
    case 'skip':
        this.SkipSong(UserMessage);
        return;
    case 'stop':
        this.StopMusic(UserMessage);
        return;
    case 'pause':
        this.PauseSong(UserMessage);
        return;
    case 'resume':
        this.ResumeSong(UserMessage);
        return;
    case 'list':
        this.ShowList(UserMessage);
        return;
    }
  }

  async JoinChannel(UserMessage, CommandArguments)
  {
      //Notify the user we will try to join their voice channel
      var Reply = await UserMessage.channel.send('Attempting to join ' + UserMessage.author.username + 's voice channel.');

      //Get the info about this server
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //Ignore users who send this command who arent in a voice channel
      if(!UserMessage.member.voiceChannel)
      {
          Reply.edit('ERROR: You must be in a voice channel to summon me.');
          return;
      }

      //If we are already connected to a voice channel, but its a different one than the user, then we should move over to their channel
      if(CurrentServer.InVoice && CurrentServer.VoiceChannel != UserMessage.member.voiceChannel)
      {
          Reply.edit('I am already connected to a different voice channel, attempting to move to ' + UserMessage.author.username + 's channel.');
          CurrentServer.VoiceConnection.disconnect();
          UserMessage.member.voiceChannel.join()
          .then(connection => {
              //move success
              Reply.edit('Moved to ' + UserMessage.author.username + 's voice channel');
              CurrentServer.InVoice = true;
              CurrentServer.VoiceChannel = UserMessage.member.voiceChannel;
              CurrentServer.VoiceConnection = connection;
              CurrentServer.Dispatcher = CurrentServer.Server.dispatcher;
              return;
          }).catch(function() {
              //move fail
              Reply.edit('Something went wrong while trying to move to ' + UserMessage.author.username + 's voice channel');
              CurrentServer.InVoice = false;
              return;
          });
      }

      //Otherwise, we simply just try to join the users voice channel
      UserMessage.member.voiceChannel.join()
      .then(connection => {
          Reply.edit('Joined ' + UserMessage.author.username + 's voice channel');
          CurrentServer.InVoice = true;
          CurrentServer.VoiceChannel = UserMessage.member.voiceChannel;
          CurrentServer.VoiceConnection = connection;
          return;
      }).catch(function() {
          Reply.edit('Something went wrong while trying to join ' + UserMessage.author.username + 's voice channel');
          CurrentServer.InVoice = false;
          return;
      });
  }

  async LeaveChannel(UserMessage)
  {
      var Reply = await UserMessage.channel.send('Trying to leave my current voice channel.');
      //Find the server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);
      //Ignore them if we arent currently in a voice channel
      if(!CurrentServer.InVoice)
      {
          Reply.edit('Huh? Im not in any voice channel.');
          return;
      }
      //Otherwise, leave the channel
      CurrentServer.InVoice = false;
      CurrentServer.SongList = [];
      CurrentServer.PlayingMusic = false;
      CurrentServer.VoiceConnection.disconnect();
      Reply.edit('Leave the voice channel.');
  }

  async PlaySong(UserMessage, CommandArguments)
  {
      var Reply = await UserMessage.channel.send('Processing ' + UserMessage.author.username + 's song request.');
      //Get info about this current server
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);
      //Grab the song link from the user input
      var ArgSplit = UserMessage.content.split(' ');
      var SongRequest = String(ArgSplit[ArgSplit.length-1]);

      //Ignore empty requests
      if(SongRequest == '')
      {
          Reply.edit('ERROR: You need to provide a link to a youtube video to request.');
          return;
      }

      //Validate the link the user sent to make sure its a valid youtube link
      if(!this.ValidateYouTubeLink(UserMessage, SongRequest))
      {
          Reply.edit('ERROR: That link doesnt look right, did you link me to a youtube video?');
          return;
      }

      //Ignore requests when the bot and the user arent in the same voice channel together
      if(!UserMessage.member.voiceChannel || !CurrentServer.InVoice || UserMessage.member.voiceChannel != CurrentServer.VoiceChannel)
      {
          Reply.edit('ERROR: We need to both be connected into the same voice channel for me to play the song for you.');
          return;
      }

      //If we are already playing music, show that this song has been added to the queue
      if(CurrentServer.PlayingMusic)
      {
          //Look up the name of the youtube video that the user linked
          const SongInfo = await YTDL.getInfo(SongRequest);
          Reply.edit(SongInfo.title + ' has been added to the queue by ' + UserMessage.author.username);
          CurrentServer.SongList.push(SongRequest);
          return;
      }

      //Then if nothing was playing yet, play the new song immediately
      const SongInfo = await YTDL.getInfo(SongRequest);
      Reply.edit('Now playing: ' + SongInfo.title);
      CurrentServer.PlayingMusic = true;
      CurrentServer.Dispatcher = CurrentServer.VoiceConnection.playStream(YTDL(SongRequest, {filter: 'audioonly'}));

      //Register a callback function to trigger when this song finishes, it will go to the next song or end music playing
      CurrentServer.Dispatcher.on('end', function() {
          global.MusicPlayer.NextSong(UserMessage);
      });
  }

  //Callback function to play the next song once the current song finishes
  NextSong(UserMessage)
  {
      //Get server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //Finish up if we have reached the end of the song list
      if(CurrentServer.SongList.length <= 0)
      {
          UserMessage.channel.send('No more songs to play');
          CurrentServer.PlayingMusic = false;
          CurrentServer.InVoice = false;
          CurrentServer.VoiceConnection.disconnect();
          CurrentServer.SongList = [];
          return;
      }

      //Play the next song in the list
      var SongRequest = CurrentServer.SongList[0];
      CurrentServer.Dispatcher = CurrentServer.VoiceConnection.playStream(YTDL(SongRequest, {filter: 'audioonly'}));
      //Remove this song from the queue
      CurrentServer.SongList.shift();
      //Notify the new song has started playing
      this.NotifySongStart(UserMessage, SongRequest);

      //Register a recursive callback back into this function every time a song completes, to automatically
      //come back and start the next song in the list, over and over until the list is exhausted
      CurrentServer.Dispatcher.on('end', function() {
          global.MusicPlayer.NextSong(UserMessage);
      });
  }

  async NotifySongStart(UserMessage, SongRequest)
  {
      var Reply = await UserMessage.channel.send('Loading next song...');
      const SongInfo = await YTDL.getInfo(SongRequest);
      Reply.edit('Now playing: ' + SongInfo.title);
  }

  async SkipSong(UserMessage)
  {
      var Reply = await UserMessage.channel.send('Skipping to the next song...');
      //Get server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //Reject this request if bot not in voice, user not in same voice as bot, or song list empty
      if(!CurrentServer.InVoice || !UserMessage.member.voiceChannel || (CurrentServer.VoiceChannel != UserMessage.member.voiceChannel) || !CurrentServer.PlayingMusic)
      {
          Reply.edit('Whoops, we both need to be in the same voice channel to use music commands.');
          return;
      }

      //Tell the dispatcher to end and it will automatically move onto the next song
      CurrentServer.Dispatcher.end();
  }

  async StopMusic(UserMessage)
  {
      var Reply = await UserMessage.channel.send('Stopping all music');
      //Get server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //Ignore if bot not in voice, user not in voice, not in same voice, not playing music
      if(!CurrentServer.InVoice || !UserMessage.member.voiceChannel || (CurrentServer.VoiceChannel != UserMessage.member.voiceChannel) || !CurrentServer.PlayingMusic)
      {
          Reply.edit('Whoops, we both need to be in the same voice channel to use music commands.');
          return;
      }

      CurrentServer.PlayingMusic = false;
      CurrentServer.SongList = [];
      CurrentServer.Dispatcher.end();
      Reply.edit('All music stopped');
  }

  ShowList(UserMessage)
  {
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //Ignore the request if the song list is empty
      if(CurrentServer.SongList.length <= 0)
      {
          UserMessage.reply('The song list is empty.');
          return;
      }

      this.ListDisplay(UserMessage);
  }

  async ListDisplay(UserMessage)
  {
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);
      var SongList = '---Song List---\n';
      var ListMessage = await UserMessage.channel.send('Fetching song list...');
      for(var i = 0; i < CurrentServer.SongList.length; i++)
      {
          var CurrentSong = CurrentServer.SongList[i];
          const SongInfo = await YTDL.getInfo(CurrentSong);
          SongList += ('#' + (i+1) + ': ' + SongInfo.title + '\n');
      }
      ListMessage.edit(SongList);
  }

  async PauseSong(UserMessage)
  {
      var Reply = await UserMessage.channel.send('Pausing the current song...');
      //Get server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //ignore request when irrelevant
      if(!CurrentServer.InVoice || !UserMessage.member.voiceChannel || (CurrentServer.VoiceChannel != UserMessage.member.voiceChannel) || !CurrentServer.PlayingMusic)
      {
          Reply.edit('Whoops, we both need to be in the same voice channel to use music commands.');
          return;
      }

      //ignore if already paused
      if(CurrentServer.MusicPaused)
      {
          Reply.edit('Whoops, the songs already paused.');
          return;
      }

      CurrentServer.MusicPaused = true;
      CurrentServer.Dispatcher.pause();
      Reply.edit('Song paused');
  }

  async ResumeSong(UserMessage)
  {
      var Reply = await UserMessage.channel.send('Resuming the current song...');
      //Get server info
      var CurrentServer = this.FindServerByID(UserMessage.guild.id);

      //ignore request when irrelevant
      if(!CurrentServer.InVoice || !UserMessage.member.voiceChannel || (CurrentServer.VoiceChannel != UserMessage.member.voiceChannel) || !CurrentServer.PlayingMusic)
      {
          Reply.edit('Whoops, we both need to be in the same voice channel to use music commands.');
          return;
      }

      //ignore when not paused
      if(!CurrentServer.MusicPaused)
      {
          Reply.edit('Whoops, the song isnt paused');
          return;
      }

      //resume the song
      CurrentServer.MusicPaused = false;
      CurrentServer.Dispatcher.resume();
      Reply.edit('Song resumed.');
  }

  FindServerByID(ServerID)
  {
      for(var i = 0; i < global.Servers.length; i++)
      {
          //Find and return the server they are looking for
          var ServerInfo = global.Servers[i];
          if(ServerInfo.ServerID == ServerID)
            return ServerInfo;
      }
      console.log('couldnt find any server matching that ID: ' + ServerID);
  }

  ValidateYouTubeLink(UserMessage, URL)
  {
      var Expression = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
      return (URL.match(Expression)) ? RegExp.$1 : false;
  }
}

module.exports.MusicCommands = MusicCommands;
