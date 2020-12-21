import { MODAL_TYPE } from "../../../common/Enum";

const types = ["String", "Numeric", "IP"];
const modalType = MODAL_TYPE.common;

export default async (number) => {
    let names = await (await fetch("https://random-word-api.herokuapp.com/word?number=" + number)).json();
    
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
