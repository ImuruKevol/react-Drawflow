import React, { useState } from "react";

const DrawflowNodeBlock = ({
    NodeContent,
    params,
    blockType = "common",
}) => {
    // params: {nodeId, port, pos, data}
    // port: {in: Number, out: Number}
    // pos:  {x: Number, y: Number }
    // const [data, setData] = useState({});
    let data = {};

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
    <div className={"parent-node drawflow-node-block-" + blockType}>
        {portComponent("in")}
        {portComponent("out")}
        <NodeContent
            id={"node-" + params.nodeId}
            // addNode 함수 참고하고 live demo 참고하여 class tree 구조 잡기
            className="drawflow-node"
            {...params}
        />
    </div>
    );
}

export default DrawflowNodeBlock;