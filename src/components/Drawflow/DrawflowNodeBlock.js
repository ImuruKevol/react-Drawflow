import React, { useEffect, useState, useRef } from "react";

const DrawflowNodeBlock = ({
    getCanvasInfo,
    zoom,
    NodeContent,
    params,
    editLock,
    blockType = "common",
    ports,
    pushPorts,
    showButton,
    setShowButton,
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

    const [refs, setRefs] = useState({
        inputs: [],
        outputs: [],
    });
    const ref = useRef(null);

    const getPortPosWithZoom = (size, pos) => {
        const canvas = getCanvasInfo();
        const widthZoom = (canvas.width / (canvas.width * zoom)) || 0;
        const heightZoom = (canvas.height / (canvas.height * zoom)) || 0;
        const x = size.width/2 + (pos.x - canvas.x ) * widthZoom;
        const y = size.height/2 + (pos.y - canvas.y ) * heightZoom;

        return {x, y};
    }

    // input port, output port coponent
    const portComponent = (type) => {
        let arr = [];

        for(let i=1;i<=params.port[type];i++) {
            const port = 
                <div
                    // ref={ref => {
                    //     if(ref && !refs[`${type}put`][i]) {
                    //         // console.log(params.id, `${type}put`, i);
                    //         refs[`${type}put`][i] = ref;
                    //         // setRefs({
                    //         //     ...refs,
                    //         //     [`${type}put`]: {
                    //         //         ...refs[`${type}put`],
                    //         //         [i]: ref,
                    //         //     }
                    //         // });
                    //     }
                    //     // TODO: need optimizing
                    //     const key = `${params.id}_${type}_${i}`;
                    //     if(ref && ref.getBoundingClientRect && !ports[key]) {
                    //         const rect = ref.getBoundingClientRect();
                    //         const size = {
                    //             width: ref.offsetWidth,
                    //             height: ref.offsetHeight,
                    //         };
                    //         const pos = {
                    //             x: rect.x,
                    //             y: rect.y,
                    //         };
                    //         pushPort(key, getPortPos(size, pos))
                    //     }
                    // }}
                    key={`drawflow-node-${type}put-${i}`}
                    className={`${type}put`}
                    onMouseUp={e => {
                        event.createPath(e, params.id, i);
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

    useEffect(() => {
        if(ref.current) {
            const inputs = Array.from(ref.current.querySelector(".inputs").children);
            const outputs = Array.from(ref.current.querySelector(".outputs").children);
            setRefs({
                inputs,
                outputs,
            });
        }
    }, [ref]);

    const getPortPos = (type, i, elmt) => {
        const key = `${params.id}_${type}_${i}`;
        if(!ports[key]) {
            const rect = elmt.getBoundingClientRect();
            const size = {
                width: elmt.offsetWidth,
                height: elmt.offsetHeight,
            };
            const pos = {
                x: rect.x,
                y: rect.y,
            };
            return {
                [key]: getPortPosWithZoom(size, pos),
            }
        }
    }

    useEffect(() => {
        if(refs.inputs && refs.outputs && params.port.in === refs.inputs.length && params.port.out === refs.outputs.length) {
            console.log("test")
            let newPorts = {};
            newPorts = Object.assign(newPorts, refs.inputs.reduce((acc, elmt, i) => {
                return Object.assign(acc, getPortPos("in", i + 1, elmt));
            }, {}));
            newPorts = Object.assign(newPorts, refs.outputs.reduce((acc, elmt, i) => {
                return Object.assign(acc, getPortPos("out", i + 1, elmt));
            }, {}));
            pushPorts(newPorts);
        }
    }, [refs]);

    return (
    // TODO: handler overriding(action)
    // If you want, change styled component. My case is not supported styled component...
    <>
        <div
            ref={ref}
            className={`drawflow-node-block-${blockType} ${params.type.replace(/\s/g, "").toLowerCase()}`}
            style={{
                position: "absolute",
                top: params.pos.y + "px",
                left: params.pos.x + "px",
                cursor: editLock?"auto": "move"
            }}
            onMouseDown={e => {
                if(e.currentTarget.classList.contains(`drawflow-node-block-${blockType}`)) {
                    event.select(e, params.id);
                }
            }}
            onMouseMove={e => {
                event.moveNode(e, params.id);
            }}
            onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                setShowButton(params.id);
            }}
        >
            {portComponent("in")}
            <div
                className="drawflow-node-content"
            >
                <NodeContent
                    {...params}
                    // select={event.select}
                    setData={event.setData}
                />
            </div>
            {portComponent("out")}
            <button
                style={{
                    display: showButton === params.id?"block":"none"
                }}
                className="drawflow-delete"
                onMouseDown={(e) => {e.stopPropagation(); event.nodeDelete()}}
            >X</button>
        </div>
    </>
    );
}

export default DrawflowNodeBlock;
