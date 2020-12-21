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

const CURV = 0.5;

export {
    CURV,
    MODAL_TYPE,
    MODAL_LABEL,
}
