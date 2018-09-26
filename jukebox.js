const command = require('discord.js-commando');
const YTDL = require('ytdl-core');

class Jukebox
{
    constructor()
    {
        console.log("jukebox init");
        this.servers = {};
    }

    JukeboxPlay(message, args)
    {
        console.log("jukebox play");
    }

    JukeboxPause(message, args) {
        console.log("jukebox pause");
    }

    JukeboxSkip(message, args) {
        console.log("jukebox skip");
    }

    JukeboxJoin(message, args) {
        console.log("jukebox join");
    }

    JukeboxLeave(message, args) {
        console.log("jukebox leave");
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
