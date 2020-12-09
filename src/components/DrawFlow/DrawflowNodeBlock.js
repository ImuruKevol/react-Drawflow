import React, { useState } from "react";

const DrawflowNodeBlock = ({
    NodeContent,
    params,
    blockType = "common",
}) => {
    // params: {nodeId, label, port, pos, data}
    // port: {in: Number, out: Number}
    // pos:  {x: Number, y: Number }

    /**
     * blockType
     * - common
     * - custom(naming is free, but need possible className)
     */

    let data = {};
    // const [data, setData] = useState({});

    // input port, output port coponent
    const portComponent = (type) => {
        let arr = [];
        data[`${type}put`] = {};
        for(let i=1;i<=params.port[type];i++) {
            arr.push(<div key={`drawflow-node-${type}put-${i}`} className={`${type}put ${type}put_${i}`}></div>);
            data[`${type}put`][`${type}put_${i}`] = {connections: []};
        }
        console.debug(type, data[`${type}put`]);
        return (
        <div className={`${type}puts`}>
            {arr.map(ele => ele)}
        </div>
        );
    }

    return (
    /*
    div.parent-node(change drawflow-node-block-${blockType})
        div#node-${num}.drawflow-node.facebook style{위치}          // 부모와 통합
            div.inputs
            div.drawflow_content_node
                div {content}       // 굳이? or NodeContent?        // 부모와 통합
            div.outputs
    */
   // TODO: handler overriding(action)
   // If you want, change styled component. My case is not supported styled component...
    <div
        className={`drawflow-node-block-${blockType} ${params.label.replace(/\s/g, "").toLowerCase()}`}
        style={{
            position: "absolute",
            top: params.pos.y + "px",
            left: params.pos.x + "px",
        }}
    >
        {portComponent("in")}
        <div
            className="drawflow-node-content"
        >
            <NodeContent
                {...params}
            />
        </div>
        {portComponent("out")}
    </div>
    );
}

export default DrawflowNodeBlock;
