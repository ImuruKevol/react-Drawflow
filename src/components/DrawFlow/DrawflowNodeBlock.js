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
    /*
    div.parent-node(change drawflow-node-block-${blockType})
        div#node-${num}.drawflow-node.facebook style{위치}          // 굳이 div를 2중으로 써야할까?
            div.inputs
            div.drawflow_content_node
                div {content}       // 굳이? or NodeContent?
            div.outputs
    */
   // class Overriding(style), handler overriding(action)
    <div className={"drawflow-node-block-" + blockType}>
        {portComponent("in")}
        <NodeContent
            id={"node-" + params.nodeId}
            // addNode 함수 참고하고 live demo 참고하여 class tree 구조 잡기
            className="drawflow-node"
            {...params}
        />
        {portComponent("out")}
    </div>
    );
}

export default DrawflowNodeBlock;