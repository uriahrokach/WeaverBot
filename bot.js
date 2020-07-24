/** Imports */
const Discord = require('discord.js');
const fs = require('fs');

/** The Discord client*/
const client = new Discord.Client();

/** The prifixs for the command*/
const PREFIX = '!w'

/** Discord bot token*/
const token = 'NzM2MjI0MDA1OTk2MDE5Nzkz.XxrsCQ.kD_Mz6EdsN1QuVXvXqU4HXmlnBg');

/**Command files for server*/
const comamndFiles = fs.readdirSync('./commands').filter( 
    file => file.endsWith('.js')
);
for (const file of comamndFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

/**
 * Startup response when logging into the server.
 */
client.once('ready', () => {
    console.log('WeaverBot is online');
});

/**
 * Analyzes a command and returns a it's fragments. If the message is not a command,
 * return null.
 * 
 * @param {*} message The message sent by the user.
 */
const analize_command = message => {
   if(!message.content.startsWith(PREFIX) || message.author.bot){
       return null;
   }

   const fragments = message.content.toLowerCase().slice(PREFIX.length).split(/ +/);
   const command  = fragments[0];
   const args = fragments.slice(1);
   
   return command, args;
};

/**
 * Checks if a message was sent in the server, and analyzes it. If it was a valid command,
 * calculates it.
 */
client.on('message', message => {
    const command, args = analize_command(message);
    if(command) {
        client.commands.get(command).execute(args)
    }
});


client.login(token);
