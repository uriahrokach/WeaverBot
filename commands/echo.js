/**
 * A command that echos back the message to the user.
 */
module.exports = {
    name: 'echo',
    desctiption: 'echos what the user said back to him',
    
    /** Echos back the args to the user.*/
    execute: (message, args) => {
        message.channel.send(args.join(' '))
    }
}