/** Imports */
const Discord = require('discord.js');
const fs = require('fs');

/** The Discord client*/
const client = new Discord.Client();

/** The prifixs for the command*/
const PREFIX = '!w '

/** Discord bot token*/
const token = 'NzM2MjI0MDA1OTk2MDE5Nzkz.XxrsCQ.7AHveAAamlHlPNWW3Y1OrwXPMNM';

/** Command Dictionary */
let commands = {};

/**Command files for server*/
const comamndFiles = fs.readdirSync('./commands').filter(
    file => file.endsWith('.js')
);
for (const file of comamndFiles) {
    const command = require(`./commands/${file}`);
    commands[command.name] = command;
}

/**
 * Startup response when logging into the server.
 */
client.once('ready', () => {
    console.log('WeaverBot is online');
});


/**
 * Checks if a message was in the right command format.
 * 
 * @param {String} message the message given.
 */
const isCommand = message => {
    return message.content.startsWith(PREFIX) && !message.author.bot;
}

/**
 * Analyzes a command and returns a it's fragments.
 * 
 * @param {String} message The message sent by the user.
 */
const analizeCommand = message => {
    const fragments = message.content.toLowerCase().slice(PREFIX.length).split(/ +/);
    const command = fragments[0];
    const args = fragments.slice(1);

    return { command, args };
};

/**
 * Checks if a message was sent in the server, and analyzes it. If it was a valid command,
 * calculates it.
 */
client.on('message', message => {
    if (isCommand(message)) {
        const { command, args } = analizeCommand(message);
        if (command in commands) {
            commands[command].execute(message, args);
        }
        else {
            message.channel.send(`Command ${command} does not exist. Please try again.`);
        }
    }
});


client.login(token);
