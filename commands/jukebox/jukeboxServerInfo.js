//Contains all the information that is needed for the jukebox regarding a single server
class JukeboxServerInfo
{
    constructor(newServer)
    {
        //Basic info about the server
        this.server = newServer;
        this.serverID = newServer.id;

        //Info related to what voice channel we are connected to
        this.inVoice = false;
        this.voiceChannel = -1;
        this.voiceConnection = null;

        //Info regarding active music playback and the list of songs we are playing
        this.playingMusic = false;
        this.musicPaused = false;
        this.songList = [];
        this.dispatcher = null;
        this.currentSongLink = null;
    }
}

module.exports.JukeboxServerInfo = JukeboxServerInfo;
