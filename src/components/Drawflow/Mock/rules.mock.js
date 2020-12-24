import { MODAL_TYPE } from "../../../common/Enum";

/**
 * type: field | rule
 * value type: type field -> String | Numeric | IP , type rule -> Single | Threshold
 * name
 * modal type(node dbl click): user custom
 * addon(optional)
 */

const types = ["Single", "Threshold"];

const isInludeAndSearch = (searchWord, target) => {
    const arr = searchWord.toLowerCase().split(" ").filter(item => item.length > 0);
    return arr.filter(word => target.toLowerCase().includes(word)).length === arr.length;
}

const makeRandomNames = (length, searchWord) => {
    const result = [];
    const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let j=0;j<length;j++) {
        let word = "";
        for (let i=0;i<Math.floor(Math.random() * 15 + 5);i++) {
           word += map.charAt(Math.floor(Math.random() * map.length));
        }
        if(isInludeAndSearch(searchWord, word)) {
            result.push(word);
        }
    }
    return result;
 }

const getSingle = async (number, searchWord = "") => {
    let names = makeRandomNames(number, searchWord);
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


const getThreshold = async (number, searchWord = "") => {
    let names = makeRandomNames(number, searchWord);
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

// TODO : single, threshold 분리
export default async (number) => {
    
    return {
        type: "rule",
        single: await getSingle(number),
        threshold: await getThreshold(number),
    };
}
