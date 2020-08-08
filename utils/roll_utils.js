module.exports = {

    /** The sides of the dice to throw. */
    SIDES: 10,

    /** The number from which to enact panelty on the roll. */
    DOWNER: 1,

    /** The basic difficulty. Used when the roll doesn't have a specified roll.*/
    BASE_DIFF: 6,

    /** The number from which to reroll the dice again. */
    REROLL:10,

    /**
     * rolls a a flat dice roll (No rules apply).
     * 
     * @param {number} num the number of dice.
     * @param {number} diff the difficulty of the roll.
     * 
     * @returns {object} an object contaning the final result and summery.
     */
    rollDiceFlat: (num, diff) => {
        let result_list = []; 
        let final_score = 0;

        for(let i = 0; i < num; i++) {
            result_list[i] = Math.ceil(Math.random() * module.exports.SIDES);
            if(result_list[i] >= diff) {
                final_score++;
            }
        }
        result_list.sort((a, b) => a - b);

        return {
            score: final_score,
            summery: result_list.join(' ')
        };

    }, 

    /**
     * rolls a dice by the current ruleset.
     * 
     * @param {number} num the number of dice.
     * @param {number} diff the difficulty of the roll.
     * @param {boolean} isProf is the roll proffcinal or not.
     * 
     * @returns {object} an object contaning the final result and summery.
     */
    rollDice: (num, diff, isProf) => {
        let isBotch = true;
        let result_list = []; 

        for(let i = 0; i < num; i++) {
            result_list[i] = Math.ceil(Math.random() * module.exports.SIDES);
            if(result_list[i] >= diff) {
                isBotch = false;
            }
        }
 
        result_list.sort((a, b) => a - b);
        if (result_list[0] != 1) {
            isBotch = false;
        }

        let results =  calculate_result(result_list, diff, isProf);
        let final_score = get_score(results.calc, results.reroll, diff);
        let summery = get_summery(result_list, results.calc, results.reroll);

        return {
            score: final_score,
            summery: (isBotch ? 'BOTCH: ' : '') + summery
        };
    }
}

/**
 * Creates a 'true' list of results, meaning only those who count,
 * and a list of rerolls.
 * 
 * @param {Array} result_list the list of original results. 
 * @param {number} diff the difficulty of the roll.
 * @param {boolean} isProf if the roll was a profficiancy roll.
 * 
 * @returns {object} An object of two lists: one of the true results, the other of the rerolls..
 */
const calculate_result = (result_list, diff, isProf) =>{
    let calc_results = Array.from(result_list);

    if (isProf && calc_results[0] <=module.exports.DOWNER) {
        calc_results.shift();
    }

    while(calc_results[0] <= module.exports.DOWNER && calc_results[calc_results.length - 1] >= diff) {
        calc_results.shift();
        calc_results.pop();
    } 

    
    let reroll_results = [];
    for(let i = 0; i < calc_results.length; i++) {
        if (calc_results[i] >= module.exports.REROLL) {
            reroll_results.push(Math.ceil(Math.random() * module.exports.SIDES));
        }
    }
    return {
        calc: calc_results,
        reroll: reroll_results
    };
}

/**
 * Returns the final score and results of the roll. 
 * 
 * @param {Array} calc_results the array of the true results.
 * @param {Array} reroll_results the array of the reroll results.
 * @param {number} diff the difficulty of the roll.
 * 
 * @returns {number} the final result of the roll.
 */
const get_score = (calc_results, reroll_results, diff) => {    
    
    const summer = (prev_sum, current) => {
        if(current >= diff) {
            return prev_sum + 1;
        }
    
        return prev_sum;
    };

    let final_score = 0;
    if (calc_results.length != 0) {
        final_score += calc_results.reduce(summer, 0);
    }

    if (reroll_results.length != 0) {
        final_score += reroll_results.reduce(summer, 0);
    }

    return final_score;

}

/**
 * Creates a string summery of the roll.
 * 
 * @param {Array} result_list a list of the original results. 
 * @param {Array} calc_results a list of the "true" results.
 * @param {Array} reroll_results a list of all the reroll results.
 * 
 * @returns {string} a string summery of the roll. 
 */
const get_summery = (result_list, calc_results, reroll_results) => {
    let side_index = 0;
    let str_results = '';

    for (let result of result_list) {
        if (calc_results.includes(result)){
            str_results += `${result}`;
            calc_results.splice(calc_results.indexOf(result), 1);

            if(result >= module.exports.REROLL){
                str_results += ` (${reroll_results[side_index]})`;
                side_index++;
            }
        } else {
            str_results += `~~${result}~~`;
        }
        str_results+= ' ';
    }

    return str_results;
}