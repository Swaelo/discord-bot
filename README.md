# -how to install and run-  
## the following instructions assume you have a fresh windows installation, follow the steps correctly and you should be fine
visit the nodejs.org website so you can download and install the latest release version of node js  
next visit the gitforwindows.org website so you can download and install git functionality for your terminal  
navigate your terminal to the directory where you want the bot to be housed, run the following command to make your own clone  
`git clone https://github.com/Swaelo/swaelo-bot.git`    (you could alternatively link your fork so you can make your own changes)  
open your terminal and execute the following commands 1 by 1 to install some of the libs needed for the bot to function  
`npm install discord.js`
`npm install discord.js-commando`  
  
this monster of a command will install chocolatey  
```@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"```  
  
use chocolatey to install ffmpeg as it doesnt seem to work correctly when trying to do it with npm  
`choco install ffmpeg`  
keep running commands to set up libs  
`npm install opusscript`
`npm install ytdl-core`
`npm install swaelos-youtube-validator`  
  
now we have everything set up and we are ready to turn the bot on
open your terminal to the bots directory and run `node .`, which will automatically find and detect the nearest package.json file
contained within is all the information that node needs to run the bot correctly
if you check discord you should now be able to see the bot connected to the server, staying there and interacting with everyone
  until you close your terminal or the bot crashes or something
