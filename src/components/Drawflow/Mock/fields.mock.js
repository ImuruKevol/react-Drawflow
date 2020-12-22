import { MODAL_TYPE } from "../../../common/Enum";

const types = ["String", "Numeric", "IP"];
const modalType = MODAL_TYPE.common;

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

export default async (number) => {
    let names = makeRandomNames(number);
    
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
