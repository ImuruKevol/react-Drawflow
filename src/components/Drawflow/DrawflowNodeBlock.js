import React, { useEffect, useState, useRef } from "react";
import handler from "./drawflowHandler";

const DrawflowNodeBlock = ({
    zoom,
    NodeContent,
    params,
    editLock,
    ports,
    pushPorts,
    showButton,
    setShowButton,
    showModal,
    event,
}) => {
    const [refs, setRefs] = useState({
        inputs: [],
        outputs: [],
    });
    const ref = useRef(null);

    const getPortPosWithZoom = (size, pos) => {
        const canvas = handler.getCanvasInfo();
        const widthZoom = (canvas.width / (canvas.width * zoom)) || 0;
        const heightZoom = (canvas.height / (canvas.height * zoom)) || 0;
        const x = size.width/2 + (pos.x - canvas.x ) * widthZoom;
        const y = size.height/2 + (pos.y - canvas.y ) * heightZoom;

        return {x, y};
    }

    const portComponent = (type) => {
        let arr = [];

        for(let i=1;i<=params.port[type];i++) {
            const port = 
                <div
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
    // If you want, change styled component. My case is not supported styled component...
    <>
        <div
            ref={ref}
            className={`drawflow-node-block-${params.type.replace(/\s/g, "").toLowerCase()}`}
            style={{
                top: params.pos.y + "px",
                left: params.pos.x + "px",
                cursor: editLock?"auto": "move",
            }}
            onMouseDown={e => {
                if(e.currentTarget.classList.contains(`drawflow-node-block-${params.type.replace(/\s/g, "").toLowerCase()}`)) {
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
            onDoubleClick={() => {
                showModal(params.modalType);
            }}
        >
            {portComponent("in")}
            <div
                className="drawflow-node-content"
            >
                <NodeContent
                    {...params}
                    setData={(data) => {
                        event.setData(params.id, data);
                    }}
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
