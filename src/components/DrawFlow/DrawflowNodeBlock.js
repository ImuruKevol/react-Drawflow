import React, { useEffect, useState } from "react";

const DrawflowNodeBlock = ({
    NodeContent,
    params,
    blockType = "common",
}) => {
    // params
    // {
    //     id: nodeId,
    //     type: type,
    //     data: data,
    //     port: {in: Number, out: Number}
    //     connections: {
    //         inputs: {},
    //         outputs: {},
    //     },
    //     pos: {
    //         x: Double,
    //         y: Double,
    //     },
    // };

    /**
     * blockType
     * - common
     * - custom(naming is free, but need possible className)
     */

    const [connections, setConnections] = useState([]);

    const pathComponent = (classList) => {
        return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classList.join(" ")}
        >
            <path
                xmlns="http://www.w3.org/2000/svg"
                className="main-path"
                d=""
                // d="M 10 10 L 50 50"
            >

            </path>
        </svg>
        );
    }
    
    const makePath = (conn, input_item, output_item) => {
        let svgClassList = [];
        svgClassList.push("connection");
        svgClassList.push("node_in_node-"+conn.id);
        svgClassList.push("node_out_node-"+conn.inputs[input_item].connections[output_item].node);
        svgClassList.push(conn.inputs[input_item].connections[output_item].input);
        svgClassList.push(input_item);
        
        return pathComponent(svgClassList);
    }

    const drawConnections = (conn) => {
        let arr = [];
        Object.keys(conn.inputs).map(inputItem => {
            Object.keys(conn.inputs[inputItem].connections).map(outputItem => {
                const connection = makePath(conn, inputItem, outputItem);
                arr.push(connection);
                return null;
            });
            return null;
        });
        setConnections(arr);
    }

    // input port, output port coponent
    const portComponent = (type) => {
        let arr = [];

        for(let i=1;i<=params.port[type];i++) {
            arr.push(<div key={`drawflow-node-${type}put-${i}`} className={`${type}put ${type}put_${i}`}></div>);
        }

        return (
        <div className={`${type}puts`}>
            {arr.map(ele => ele)}
        </div>
        );
    }

    useEffect(() => {
        drawConnections(params.connections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    <>
        <div
            className={`drawflow-node-block-${blockType} ${params.type.replace(/\s/g, "").toLowerCase()}`}
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
        {connections.map(conn => conn)}
    </>
    );
}

export default DrawflowNodeBlock;
