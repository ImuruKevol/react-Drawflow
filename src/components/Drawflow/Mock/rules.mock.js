import { MODAL_TYPE } from "../../../common/Enum";

/**
 * type: field | rule
 * value type: type field -> String | Numeric | IP , type rule -> Single | Threshold
 * name
 * modal type(node dbl click): user custom
 * addon(optional)
 */

const types = ["Single", "Threshold"];
const makeRandomNames = (length) => {
    const result = [];
    const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let j=0;j<length;j++) {
        let word = "";
        for (let i=0;i<Math.floor(Math.random() * 15 + 5);i++) {
           word += map.charAt(Math.floor(Math.random() * map.length));
        }
        result.push(word);
    }
    return result;
 }

const getSingle = async (number) => {
    let names = makeRandomNames(number);
    return {
        modalType: MODAL_TYPE.single,
        list: names.reduce((acc, val) => {
            acc.push({
                name: val,
            });
            return acc;
        }, []),
    };
}


const getThreshold = async (number) => {
    let names = makeRandomNames(number);
    return {
        modalType: MODAL_TYPE.threshold,
        list: names.reduce((acc, val) => {
            acc.push({
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
