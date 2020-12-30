module.exports = {

    /** The sides of the dice to throw. */
    SIDES: 10,

    /** The number from which to enact panelty on the roll. */
    DOWNER: 1,

    /** The basic difficulty. Used when the roll doesn't have a specified roll.*/
    BASE_DIFF: 6,

    /** The number from which to reroll the dice again. */
    REROLL: 10,

    /**
     * rolls a a flat dice roll (No rules apply).
     * 
     * @param {number} num the number of dice.
     * @param {number} diff the difficulty of the roll.
     * 
     * @returns {object} an object contaning the final result and summery.
     */
    rollDiceFlat: (num, diff) => {
        let resultList = [];
        let finalScore = 0;

        for (let i = 0; i < num; i++) {
            resultList[i] = Math.ceil(Math.random() * module.exports.SIDES);
            if (resultList[i] >= diff) {
                finalScore++;
            }
        }
        resultList.sort((a, b) => a - b);

        return {
            score: finalScore,
            summery: resultList.join(' ')
        };

    },

    /**
     * rolls a dice by the current ruleset.
     * 
     * @param {number} num the number of dice.
     * @param {number} diff the difficulty of the roll.
     * @param {boolean} isProf is the roll proffcinal or not.
     * @param {boolean} will di
     * 
     * @returns {object} an object contaning the final result and summery.
     */
    rollDice: (num, diff, isProf, will) => {
        let isBotch = true;
        let resultList = [];

        for (let i = 0; i < num; i++) {
            resultList[i] = Math.ceil(Math.random() * module.exports.SIDES);
            if (resultList[i] >= diff || will) {
                isBotch = false;
            }
        }

        resultList.sort((a, b) => a - b);
        if (resultList[0] != 1) {
            isBotch = false;
        } 

        let results = calculateResult(resultList, diff, isProf);
        if (results.calc[0] == 1) {
            will = false;
        }
        
        let finalScore = getScore(results.calc, results.reroll, diff, will);
        let summery = getSummery(resultList, results.calc, results.reroll);

        return {
            score: finalScore,
            summery: (isBotch ? 'BOTCH: ' : '') + summery
        };
    }
}

/**
 * Creates a 'true' list of results, meaning only those who count,
 * and a list of rerolls.
 * 
 * @param {Array} resultList the list of original results. 
 * @param {number} diff the difficulty of the roll.
 * @param {boolean} isProf if the roll was a profficiancy roll.
 * 
 * @returns {object} An object of two lists: one of the true results, the other of the rerolls..
 */
const calculateResult = (resultList, diff, isProf) => {
    let calcResults = Array.from(resultList);

    if (isProf && calcResults[0] <= module.exports.DOWNER) {
        calcResults.shift();
    }

    while (calcResults[0] <= module.exports.DOWNER && calcResults[calcResults.length - 1] >= diff) {
        calcResults.shift();
        calcResults.pop();
    }


    let rerollResults = [];
    for (let i = 0; i < calcResults.length; i++) {
        if (calcResults[i] >= module.exports.REROLL) {
            rerollResults.push(Math.ceil(Math.random() * module.exports.SIDES));
        }
    }
    return {
        calc: calcResults,
        reroll: rerollResults
    };
}

/**
 * Returns the final score and results of the roll. 
 * 
 * @param {Array} calcResults the array of the true results.
 * @param {Array} rerollResults the array of the reroll results.
 * @param {number} diff the difficulty of the roll.
 * @param {boolean} will whethear willpower was invested.
 * 
 * @returns {number} the final result of the roll.
 */
const getScore = (calcResults, rerollResults, diff, will) => {

    const summer = (prevSum, current) => {
        if (current >= diff) {
            return prevSum + 1;
        }

        return prevSum;
    };

    let finalScore = 0;
    if (calcResults.length != 0) {
        finalScore += calcResults.reduce(summer, 0);
    }

    if (rerollResults.length != 0) {
        finalScore += rerollResults.reduce(summer, 0);
    }

    return finalScore + (1 ? will : 0);

}

/**
 * Creates a string summery of the roll.
 * 
 * @param {Array} resultList a list of the original results. 
 * @param {Array} calcResults a list of the "true" results.
 * @param {Array} rerollResults a list of all the reroll results.
 * 
 * @returns {string} a string summery of the roll. 
 */
const getSummery = (resultList, calcResults, rerollResults) => {
    let sideIndex = 0;
    let strResults = '';

    for (let result of resultList) {
        if (calcResults.includes(result)) {
            strResults += `${result}`;
            calcResults.splice(calcResults.indexOf(result), 1);

            if (result >= module.exports.REROLL) {
                strResults += ` (${rerollResults[sideIndex]})`;
                sideIndex++;
            }
        } else {
            strResults += `~~${result}~~`;
        }
        strResults += ' ';
    }

    return strResults;
}