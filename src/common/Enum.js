import Nodes from "../components/Drawflow/Nodes";

const CURV = 0.5;

const LIST_TYPE = {
    FILTER: "filter",
    RULE: "rule",
}

const RULES = {
    SINGLE: "single",
    THRESHOLD: "threshold",
    CORRELATION: "correlation",
}

const RULES_LIST_TYPE = {
    [RULES.SINGLE]: LIST_TYPE.FILTER,
    [RULES.THRESHOLD]: LIST_TYPE.FILTER,
    [RULES.CORRELATION]: LIST_TYPE.RULE,
}

const nodeList = Object.keys(Nodes);
console.debug("Node Category List : ", nodeList);
const NODE_MAPPING = {
    [LIST_TYPE.FILTER]: "Common",
    [LIST_TYPE.RULE]: "Round",
}

const PAGE = {
    [RULES.SINGLE]: 200,
    [RULES.THRESHOLD]: 200,
    [RULES.CORRELATION]: 1000,
}

const MODAL_TYPE = {
    import: "import",
    common: "common",
    [RULES.SINGLE]: "single",
    [RULES.THRESHOLD]: "threshold",
    [RULES.CORRELATION]: "correlation",
}

const MODAL_LABEL = {
    [MODAL_TYPE.import]: "Import Modal",
    [MODAL_TYPE.common]: "Node Modal",
    [MODAL_TYPE[RULES.SINGLE]]: "Single Rule Modal",
    [MODAL_TYPE[RULES.THRESHOLD]]: "Threshold Rule Modal",
    [MODAL_TYPE[RULES.CORRELATION]]: "Correlation Rule Modal",
}

export {
    CURV,
    LIST_TYPE,
    RULES,
    RULES_LIST_TYPE,
    MODAL_TYPE,
    MODAL_LABEL,
    NODE_MAPPING,
    PAGE,
}
