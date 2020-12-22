const CURV = 0.5;

const MODAL_TYPE = {
    import: "import",
    common: "common",
    single: "single",
    threshold: "threshold",
}

const MODAL_LABEL = {
    [MODAL_TYPE.import]: "Import Modal",
    [MODAL_TYPE.common]: "Node Modal",
    [MODAL_TYPE.single]: "Single Rule Modal",
    [MODAL_TYPE.threshold]: "Threshold Rule Modal",
}

const NODE_CATEGORY = {
    FIELD: "field",
    RULE: "rule",
}

/**
 * node type(Common, Round) <-> node category(field, rule) mapping
 */
const NODE_MAPPING = {
    [NODE_CATEGORY.FIELD]: "Common",
    [NODE_CATEGORY.RULE]: "Round",
}

export {
    CURV,
    MODAL_TYPE,
    MODAL_LABEL,
    NODE_CATEGORY,
    NODE_MAPPING,
}
