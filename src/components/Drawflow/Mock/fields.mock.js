import { MODAL_TYPE, LIST_TYPE } from "../../../common/Enum";

const types = ["String", "Numeric", "IP"];
const modalType = MODAL_TYPE.common;


const makeRandomNames = (length, searchWord, max = 15, min = 5) => {
    const result = [];
    const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let j=0;j<length;j++) {
        let word = "";
        for (let i=0;i<Math.floor(Math.random() * (max - min) + min);i++) {
           word += map.charAt(Math.floor(Math.random() * map.length));
        }
        if(searchWord.length > 1) {
            word += searchWord;
        }
        result.push(word);
    }
    return result;
}

export default async (number, searchWord = "") => {
    let names = makeRandomNames(number, searchWord);
    
    return {
        type: LIST_TYPE.FILTER,
        modalType,
        list: names.reduce((acc, val) => {
            acc.push({
                type: types[Math.floor(Math.random() * types.length)],
                name: val,
                value: makeRandomNames(1, "", 10, 5)[0],
            });
            return acc;
        }, []),
    };
}
