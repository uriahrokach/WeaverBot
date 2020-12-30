/** Imports */
const Discord = require('discord.js');
const fs = require('fs');

/** The Discord client*/
const client = new Discord.Client();

/** The prifixs for the command*/
const PREFIX = '!w ';

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


const aliases = {
    'soak': (args) => {args.push('flat'); return 'roll';},
    'damage': (args) => {args.push('flat'); return 'roll';},
    'dmg': (args) => {args.push('flat'); return 'roll';},
    'prof': (args) => {args.push('prof'); return 'roll';},
    'r': (args) => {return 'roll';},
    's': (args) => {args.push('flat'); return 'roll';},
    'd': (args) => {args.push('flat'); return 'roll';},
    'p': (args) => {args.push('prof'); return 'roll';},
}

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
        let { command, args } = analizeCommand(message);
        
        if (command in aliases) {
            command = aliases[command](args);
        }

        if (command in commands) {
            commands[command].execute(message, args);
        }
        else {
            message.channel.send(`Command ${command} does not exist. Please try again.`);
        }
    }
});


client.login('NzkzOTQ5NzM4OTk1MTU0OTc0.X-ztUA.43tzN8KxpYg9m4znKqxFcU-rFFE');
