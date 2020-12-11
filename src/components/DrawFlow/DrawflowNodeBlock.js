import React from "react";

const DrawflowNodeBlock = ({
    canvas,
    zoom,
    NodeContent,
    params,
    blockType = "common",
    ports,
    pushPort,
    event,
}) => {
    // params
    // {
    //     id: nodeId,
    //     type: type,
    //     data: data,
    //     port: {in: Number, out: Number}
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

    const getPortPos = (size, pos) => {
        const widthZoom = (canvas.width / (canvas.width * zoom)) || 0;
        const heightZoom = (canvas.height / (canvas.height * zoom)) || 0;
        const x = size.width/2 + (pos.x - canvas.x ) * widthZoom;
        const y = size.height/2 + (pos.y - canvas.y ) * heightZoom;
        return {x, y}
    }

    // input port, output port coponent
    const portComponent = (type) => {
        let arr = [];

        for(let i=1;i<=params.port[type];i++) {
            const port = 
                <div
                    ref={ref => {
                        // TODO: need optimizing
                        const key = `${params.id}_${type}_${i}`;
                        if(ref && ref.getBoundingClientRect && !ports[key]) {
                            const rect = ref.getBoundingClientRect();
                            const size = {
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                            };
                            const pos = {
                                x: rect.x,
                                y: rect.y,
                            };
                            pushPort(key, getPortPos(size, pos))
                        }
                    }}
                    key={`drawflow-node-${type}put-${i}`}
                    className={`${type}put ${type}put_${i}`}    // TODO: ${type}put_${i} don't need?
                    onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                ></div>;
            arr.push(port);
        }

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
    <>
        <div
            className={`drawflow-node-block-${blockType} ${params.type.replace(/\s/g, "").toLowerCase()}`}
            style={{
                position: "absolute",
                top: params.pos.y + "px",
                left: params.pos.x + "px",
            }}
            onMouseDown={event.select}
            onMouseMove={e => {
                event.moveNode(e, params.id);
            }}
        >
            {portComponent("in")}
            <div
                className="drawflow-node-content"
            >
                <NodeContent
                    {...params}
                    select={event.select}
                />
            </div>
            {portComponent("out")}
        </div>
    </>
    );
}

export default DrawflowNodeBlock;
