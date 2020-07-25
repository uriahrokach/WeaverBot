const SIDES = 10;
const DOWNER  = 1;
const REROLL = 10;

module.exports = {
    name: 'roll',
    description: 'rolls a dice in current rullset',
    execute: (message, args) => {
        
    }
}

const rolldice = (num, diff) => {
    let isBotch = true;
    let result_list = [] 

    for(let i = 0; i < num; i++) {
        result_list[i] = [Math.ceil(Math.random() * SIDES)];
        if(result_list[i] > diff) {
            isBotch = false;
        }
    }
 
    result_list.sort();
    if (result_list[0] != 1) {
        isBotch = false;
    }

    let {true_results, reroll_results} =  calculate_result(result_list);
    let final_score = calculate_result(calc_results, reroll_results, diff);
    let summery = get_summery(result_list, true_results, reroll_results);

    return {final_score, str_results}
}

const calculate_result = (result_list) =>{
    let calc_results = Array.from(result_list);

    while(calc_results[0] <= DOWNER && calc_results[calc_results.length] - 1 >= diff) {
        calc_results.shift();
        calc_results.pop();
    } 

    let reroll_results = []
    for(let i = 0; i < num; i++) {
        if (calc_results[i] >= REROLL) {
            reroll_results.push(Math.ceil(Math.random() * SIDES));
        }
    }

    return {calc_results, reroll_results};
}

const get_score = (calc_results, reroll_results, diff) => {    
    let summer = (prev_sum, current) => {
        if(current >= diff) {
            prev_sum + 1;
        }
    };

    let final_score = 0;
    if (calc_results.length != 0) {
        final_score + calc_results.reduce(summer);
    }

    if (reroll_results.length != 0) {
        final_score + reroll_results.reduce(summer);
    }

    return final_score;

}

const get_summery = (result_list, calc_results, reroll_results) => {
    let side_index = 0;
    let str_results = '';

    for (let result of result_list) {
        if (result in calc_results){
            str_results += `${result}`;
            calc_results.splice(calc_results.indexOf(result), 1);

            if(result > REROLL){
                str_results += `${reroll_results[side_index]}`;
                side_index++;
            }
        } else {
            str_results += `~~${result}~~`;
        }
        str_results+= ' ';
    }

    return str_results;
}