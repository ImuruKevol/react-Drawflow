import { MODAL_TYPE } from "../../../common/Enum";

const types = ["String", "Numeric", "IP"];
const modalType = MODAL_TYPE.common;

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

export default async (number, searchWord = "") => {
    let names = makeRandomNames(number, searchWord);
    
    return {
        type: "field",
        modalType,
        list: names.reduce((acc, val) => {
            acc.push({
                type: types[Math.floor(Math.random() * types.length)],
                name: val,
            });
            return acc;
        }, []),
    };
}
