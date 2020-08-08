const Discord = require('discord.js');
const Utils = require('../utils/roll_utils.js');

const ROLL_COLOR = '#0099ff';
const ERROR_COLOR = '#dc143c';

module.exports = {
    name: 'roll',
    description: 'rolls a dice in current rullset',

    /**
     * Rolls a dice by current ruleset.
     * 
     * @param message the message sent.
     * @param args the arguments of the command.
     */
    execute: (message, args) => {
        let dice = 0;
        let diff = 0;
        let isProf = false;
        let roller = Utils.rollDice;

        addOption('flat', args, () => {
            roller = Utils.rollDiceFlat;
        })

        addOption('prof', args, () => {
            isProf = true;
        })
        try {
            if (args.includes('diff')) {
                dice = eval(args.slice(0, args.indexOf('diff')).join(''));
                diff = eval(args.slice(args.indexOf('diff') + 1, args.length).join(''));
            } else {
                dice = eval(args.join(' '));
                diff = Utils.BASE_DIFF;
            }

            if (diff >= Utils.DOWNER && diff <= Utils.REROLL) {
                let resObj = roller(dice, diff, isProf);
                const embedResult = createResultEmbed(resObj.score, resObj.summery,
                    `${message.author} rolled ${dice} dice with difficuly ${diff}` +
                    `${isProf ? ' (Professional roll)' : ''}` +
                    `${roller == Utils.rollDiceFlat ? ' (Flat roll)' : ''}`
                );
                message.channel.send(embedResult);

            } else {
                const embedError = createErrorEmbed(`${message.author}, ${diff} is not a valid difficulty.`);
                message.channel.send(embedError);
            }
        } catch (err) {
            const embedError = createErrorEmbed(`${message.author}, Command arguments are not valid.`, err.message);
            message.channel.send(embedError);
        }
    }
}

/**
 * Adds an option to the command.
 * 
 * @param {string} name the name of the option.
 * @param {Array} args the arguments of the command.
 * @param {Function} exec the function to execute if this option is valid.
 */
const addOption = (name, args, exec) => {
    if (args.includes(name)) {
        exec();
        i = args.indexOf(name);
        args.splice(i, 1);
    }
}

/**
 * Creates an embed for a result of a roll.
 * 
 * @param {number} score the score of the result. 
 * @param {string} summery the summery of the result.
 * @param {string} desc a description of the roll.
 * 
 * @returns {Discord.MessageEmbed} a new result message embed.
 */
const createResultEmbed = (score, summery, desc) => {
    const embedResult = new Discord.MessageEmbed().setTitle('Roll').setColor(ROLL_COLOR);
    embedResult.setDescription(desc);
    embedResult.addField(`Result: ${score}`, `${summery}`);
    return embedResult;
}

/**
 * Creates an embed for an error.
 * 
 * @param {string} desc a description of the error.
 * @param {string} jsError the js message of the error.
 * 
 * @returns {Discord.MessageEmbed} a new error message embed.
 */
const createErrorEmbed = (desc, jsError) => {
    const embedResult = new Discord.MessageEmbed().setTitle('Roll Error').setColor(ERROR_COLOR);
    embedResult.setDescription(desc);
    if (jsError) {
        embedResult.addField('JavaScript error:', `\`\`\`js\n${jsError}\n\`\`\``);
    }
    return embedResult;
}
