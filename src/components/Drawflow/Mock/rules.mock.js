import { MODAL_TYPE } from "../../../common/Enum";

/**
 * type: field | rule
 * value type: type field -> String | Numeric | IP , type rule -> Single | Threshold
 * name
 * modal type(node dbl click): user custom
 * addon(optional)
 */

const types = ["Single", "Threshold"];

const getSingle = async (number) => {
    let names = await (await fetch("https://random-word-api.herokuapp.com/word?number=" + number)).json();
    return {
        modalType: MODAL_TYPE.single,
        list: names.reduce((acc, val) => {
            acc.push({
                type: types[Math.floor(Math.random() * types.length)],
                name: val,
            });
            return acc;
        }, []),
    };
}


const getThreshold = async (number) => {
    let names = await (await fetch("https://random-word-api.herokuapp.com/word?number=" + number)).json();
    return {
        modalType: MODAL_TYPE.threshold,
        list: names.reduce((acc, val) => {
            acc.push({
                type: types[Math.floor(Math.random() * types.length)],
                name: val,
            });
            return acc;
        }, []),
    };
}


export default async (number) => {
    
    return {
        type: "rule",
        single: await getSingle(number),
        threshold: await getThreshold(number),
    };
}
