import React from "react";

const DrawflowNodeBlock = ({
    NodeContent,
    params,
    blockType = "common",
}) => {
    return (
    <div className={"drawflow-node-block-" + blockType}>
        <NodeContent
            {...params}
        />
    </div>
    );
}

export default DrawflowNodeBlock;