import React from "react";
import DrawflowAdditionalArea from "./DrawflowAdditionalArea";
import DrawflowZoomArea from "./DrawflowZoomArea";
import DrawflowNodeBlock from "./DrawflowNodeBlock";
import DrawflowModal from "./DrawflowModal";
import Nodes from "./Nodes";
import { createCurvature } from "./drawflowHandler";
import "./drawflow.css";
import { MODAL_TYPE, MODAL_LABEL } from "./Enum";
import dummy from "./dummy";

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
            nodeList: [],
            nodeId: 1,
            drag: false,
            canvasDrag: false,
            curvature: 0.5,
            config: {
                canvasTranslate: {
                    x: 0,
                    y: 0,
                },
                circleWidth: 6,
                lineWidth: 5,           // Todo
                zoom: {
                    value: 1,
                    max: 2,
                    min: 0.5,
                    tick: 0.1,
                },
            },
            // canvas: {x: 0, y: 0, width: 0, height: 0},
            drawflow: {},                   // {component, params} Array
            connections: {},                // {svg1: [point1, point2, ...], svg2: [...]}
            ports: {},
            editLock: false,
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
            tmpPath: null,
            modalType: null,
        }
        this.state.nodeList = Object.entries(Nodes).reduce((acc, val) => {
            acc.push({
                type: val[0],
                component: val[1],
            });
            return acc;
        }, []);
    }

    drag = (e, idx) => {
        e.dataTransfer.setData("componentIndex", idx);
    }

    drop = (e) => {
        e.preventDefault();
        const componentIndex = e.dataTransfer.getData("componentIndex");
        this.addNodeToDrawFlow(componentIndex, e.clientX, e.clientY);
    }

    makePortObj = (port) => {
        let obj = {
            inputs: {},
            outputs: {},
        };

        for(let i=1;i<=port.in;i++) {
            obj.inputs[`input_${i}`] = {connections: []};
        }
        for(let i=1;i<=port.out;i++) {
            obj.outputs[`output_${i}`] = {connections: []};
        }

        return obj;
    }

    setDrawflow = (nodeId, componentIndex, params) => {
        this.setState({
            drawflow: {
                ...this.state.drawflow,
                [nodeId]: Object.assign({}, {
                    componentIndex,
                    params,
                }),
            },
        });
    }

    /**
     * create and add node
     * @param {Number} componentIndex componentIndex
     * @param {{in: Number, out: Number}} port 
     * @param {{x: Number, y: Number }} pos 
     * @param {{}} data 
     */
    addNode = (componentIndex, port, pos, data = {}) => {
        const { nodeId } = this.state;
        const { type } = this.state.nodeList[componentIndex];
        const params = {
            id: nodeId,
            type,
            data,
            port,
            connections: this.makePortObj(port),
            pos: {
                x: pos.x,
                y: pos.y,
            },
        };
        this.setDrawflow(nodeId, componentIndex, params);
        this.setState({
            nodeId: nodeId + 1,
        });
    }

    getCanvasInfo = () => {
        // TODO : replace querySelector to someting
        const canvas = document.querySelector("#drawflow").querySelector(".drawflow");
        const canvasRect = canvas.getBoundingClientRect();
        return {
            x: canvasRect.x,
            y: canvasRect.y,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        };
    }

    getPos = (clientX, clientY) => {
        const { x, y, width, height } = this.getCanvasInfo();
        const zoom = this.state.config.zoom.value;
        return  {
            x: clientX * (width / (width * zoom)) - (x * (width / (width * zoom))),
            y: clientY * (height / (height * zoom)) - (y * (height / (height * zoom))),
        }
    }

    addNodeToDrawFlow = (componentIndex, x, y) => {
        if(this.state.editLock) return;
        const pos = this.getPos(x, y);
        // TODO: in, out -> Number to Boolean?
        this.addNode(componentIndex, {in: 1, out: 1}, pos);
    }

    makeNodeObject = (params) => {
        let componentIndex = 0;
        for(let i=0;i<this.state.nodeList.length;i++) {
            if(this.state.nodeList[i].type === params.type) {
                componentIndex = i;
                break;
            }
        }
        return {
            componentIndex,
            params,
        };
    }
    
    findPointIndex = (start, end, pathKey) => {
        const { connections, ports } = this.state;
        const arr = pathKey.split("_");
        const startKey = `${arr[0]}_out_${arr[1]}`;
        const endKey = `${arr[2]}_in_${arr[3]}`;
        let points = [
            ports[startKey],
            ...connections[pathKey],
            ports[endKey]
        ];

        for(let i=0;i<points.length - 1;i++) {
            const sp = points[i];
            const ep = points[i+1];
            if(sp.x === start.x && sp.y === start.y && ep.x === end.x && ep.y === end.y) {
                return i;
            }
        }
        return 0;
    }

    PathComponent = (start, end, pathKey, d) => {
        return (
            <path
                xmlns="http://www.w3.org/2000/svg"
                className="main-path"
                d={d}
                onMouseDown={this.select}
                onDoubleClick={e => {
                    const { connections } = this.state;
                    const pos = this.getPos(e.clientX, e.clientY);
                    if(!pathKey) return;
                    const idx = this.findPointIndex(start, end, pathKey);
                    this.setState({
                        connections: {
                            ...connections,
                            [pathKey]: [
                                ...connections[pathKey].slice(0, idx),
                                pos,
                                ...connections[pathKey].slice(idx)
                            ]
                        }
                    });
                }}
            ></path>
        );
    }

    CircleComponent = (x, y, key, svgKey, i) => {
        return (
            <circle
                key={key}
                xmlns="http://www.w3.org/2000/svg"
                className="point"
                cx={x}
                cy={y}
                r={this.state.config.circleWidth}
                onMouseDown={e => {
                    this.select(e, {
                        svgKey,
                        i,
                    });
                }}
                onMouseMove={e => {
                    this.movePoint(e, svgKey, i);
                }}
            ></circle>
        );
    }

    drawConnections = (start, end, points, idx, svgKey) => {
        let circles = points.reduce((acc, val, i) => {
            acc.push(this.CircleComponent(val.x, val.y, "draw-flow-svg-" + idx + "circle-" + i, svgKey, i));
            return acc;
        }, []);
        
        let d = null;
        if(points.length > 0) {
            let paths = null;
            paths = [{start: start, end: points[0], type: "open"}];
            for(let i=0;i<points.length - 1;i++) {
                paths.push({start: {...points[i]}, end: {...points[i+1]}, type: "openclose"});
            }
            paths.push({start: points.slice(-1)[0], end: end, type: "close"});
            d = paths.reduce((acc, val) => {
                return acc + createCurvature(val.start, val.end, this.state.curvature, val.type) + " ";
            }, "");
        }
        else {
            d = createCurvature(start, end, this.state.curvature, "openclose");
        }

        return (
        <>
            {this.PathComponent(start, end, svgKey, d)}
            {circles.map(comp => comp)}
        </>
        );
    }

    load = (data) => {
        const dataEntries = Object.entries(data.nodes);
        const { connections } = data;
        let obj = {
            connections,
        };
        
        let drawflow = {};
        for(const [nodeId, params] of dataEntries) {
            drawflow[nodeId] = this.makeNodeObject(params);
        }
        obj.drawflow = drawflow;

        const dataKeys = Object.keys(data.nodes).map(key => key*1).sort();
        if(dataKeys.length > 0) {
            obj.nodeId = dataKeys.slice(-1)*1 + 1;
        }

        this.setState({
            ...obj,
        });
    }

    clear = () => {
        this.setState({
            nodeId: 1,
            config: {
                ...this.state.config,
                canvasTranslate: {
                    x: 0,
                    y: 0,
                  },
                zoom: {
                    ...this.state.config.zoom,
                    value: 1,
                },
            },
            drawflow: {},
            connections: {},
            ports: {},
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
            tmpPath: null,
            modalType: null,
        });
    }

    importJson = () => {
        this.setState({
            modalType: MODAL_TYPE.import,
        });
    }

    exportJson = () => {
        const { drawflow, connections } = this.state;
        const nodes = Object.entries(drawflow).reduce((acc, [nodeId, data]) => {
            return {
                ...acc,
                [nodeId]: data.params,
            }
        }, {});
        const exportData = {
            nodes,
            connections,
        };
        if(!navigator.clipboard || !navigator.clipboard.writeText) return;
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)).then(() => {
            alert("json 데이터가 클립보드에 저장되었습니다.");
        });
    }

    unSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 임시 코드
        if(document.querySelector(".select"))
            document.querySelector(".select").classList.remove("select");
        if(this.state.select) this.state.select.classList.remove("select");
        this.setState({
            drag: false,
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
        });
    }

    select = (e, selectInfo) => {
        e.preventDefault();
        e.stopPropagation();
        if(this.state.select) this.state.select.classList.remove("select");
        const { target } = e;
        let element = target;
        if(target.classList.contains("drawflow-node-content")) {
            element = target.parentElement;
        }
        const isPort = target.classList.contains("input") || target.classList.contains("output");
        const isNotSeletElement = element.tagName === "circle" || isPort;
        if(!isNotSeletElement)
            element.classList.add("select");
        this.setState({
            drag: isPort? false : true,
            select: element,
            selectId: selectInfo && !selectInfo.svgKey? selectInfo : null,
            selectPoint: selectInfo && selectInfo.svgKey? selectInfo : null,
        });
    }
    
    getPortListByNodeId = (nodeId) => {
        const { ports } = this.state;
        return Object.keys(ports).filter(key => key.split(/_/g)[0] === "" + nodeId);
    }

    setPosByNodeId = (nodeId, pos, ports) => {
        this.setState({
            drawflow: {
                ...this.state.drawflow,
                [nodeId]: {
                    ...this.state.drawflow[nodeId],
                    params: {
                        ...this.state.drawflow[nodeId].params,
                        pos: {
                            x: pos.x,
                            y: pos.y,
                        }
                    }
                }
            },
            ports,
        });
    }

    movePosition = (nodeId, pos) => {
        const portKeys = this.getPortListByNodeId(nodeId);
        const ports = portKeys.reduce((acc, portKey) => {
            acc[portKey] = {
                x: acc[portKey].x + pos.x,
                y: acc[portKey].y + pos.y,
            };
            return acc;
        }, {...this.state.ports});
        const tmpPos = {
            x: this.state.drawflow[nodeId].params.pos.x + pos.x,
            y: this.state.drawflow[nodeId].params.pos.y + pos.y,
        }
        this.setPosByNodeId(nodeId, tmpPos, ports);
    }

    moveNode = (e, nodeId) => {
        if(!this.state.drag) return;
        if(e.target !== this.state.select && !e.target.classList.contains("drawflow-node-content")) return;

        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;

        this.movePosition(nodeId, {
            x: movementX,
            y: movementY,
        });
    }

    movePoint = (e, svgKey, i) => {
        if(!this.state.drag) return;
        if(e.target !== this.state.select) return;

        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;
        
        const after = {
            x: this.state.connections[svgKey][i].x + movementX,
            y: this.state.connections[svgKey][i].y + movementY,
        }
        let clone = [...this.state.connections[svgKey]];
        clone[i] = after;
        this.setState({
            connections: {
                ...this.state.connections,
                [svgKey]: clone,
            }
        });
    }

    canvasMove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;
        this.setState({
            config: {
                ...this.state.config,
                canvasTranslate: {
                    x: this.state.config.canvasTranslate.x + movementX,
                    y: this.state.config.canvasTranslate.y + movementY,
                }
            }
        });
    }

    setPosWithCursorOut = (e) => {
        const { drag, selectId, selectPoint} = this.state;
        if(!this.state.select || !drag) return;
        if(!selectId && !selectPoint) return;
        const mousePos = this.getPos(e.clientX, e.clientY);
        const select = {
            top: this.state.select.style.top.slice(0, -2)*1,
            left: this.state.select.style.left.slice(0, -2)*1,
            width: this.state.select.clientWidth,
            height: this.state.select.clientHeight,
        };
        const isInX = mousePos.x >= select.left && mousePos.x <= select.left + select.width;
        const isInY = mousePos.y >= select.top && mousePos.y <= select.top + select.height;
        if(isInX && isInY) return;
        const pos = {
            x: mousePos.x - select.width/2 - select.left,
            y: mousePos.y - select.height/2 - select.top,
        }
        if(selectId) this.movePosition(selectId, pos);
        else if(selectPoint){
            const { svgKey, i } = selectPoint;
            const after = {
                x: pos.x,
                y: pos.y,
            }
            let clone = [...this.state.connections[svgKey]];
            clone[i] = after;
            this.setState({
                connections: {
                    ...this.state.connections,
                    [svgKey]: clone,
                }
            });
        }
    }

    findIndexByElement = (elmt) => {
        const { parentElement } = elmt;
        const arr = Array.from(parentElement.childNodes);
        
        for(let i=0;i<arr.length;i++) {
            if(arr[i] === elmt) return i;
        }
        return -1;
    }

    createPath = (e, startId, startPort, endId, endPort) => {
        const { target } = e;
        if(!target.classList.contains("input")) return;
        const key = `${startId}_${startPort}_${endId}_${endPort}`;
        const { connections } = this.state;
        if(connections[key] !== undefined) return;
        this.setState({
            connections: {
                ...this.state.connections,
                [key]: [],
            }
        });
    }

    delete = () => {

    }

    setConfig = (key, value) => {
        this.setState({
            config: {
                ...this.state.config,
                [key]: value,
            }
        })
    }

    zoom = {
        in: () => {
            const { zoom } = this.state.config;
            const { value, max, tick } = zoom;
            if(value >= max) return;
            this.setConfig("zoom", {
                ...zoom,
                value: value + tick,
            });
        },
        out: () => {
            const { zoom } = this.state.config;
            const { value, min, tick } = zoom;
            if(value <= min) return;
            this.setConfig("zoom", {
                ...zoom,
                value: value - tick,
            });
        },
        reset: () => {
            const { config } = this.state;
            const { zoom } = config;
            this.setState({
                config: {
                    ...config,
                    zoom: {
                        ...zoom,
                        value: 1,
                    },
                    canvasTranslate: {
                        x: 0,
                        y: 0,
                    }
                }
            });
        }
    }

    onMouseMoveCanvas = (e) => {
        const { canvasDrag } = this.state;
        if(canvasDrag) this.canvasMove(e);

        const { select } = this.state;
        if(select && select.classList.contains("output")) {
            const { clientX, clientY } = e;
            const idx = this.findIndexByElement(select);
            const { ports, selectId } = this.state;
            const startKey = `${selectId}_out_${idx + 1}`;

            if(!ports[startKey]) return null;

            const start = {
                x: ports[startKey].x,
                y: ports[startKey].y,
            }
            // let offset = this.state.config.canvasTranslate;
            const end = this.getPos(clientX, clientY);
            // const end = this.getPos(clientX - offset.x, clientY - offset.y);

            const d = createCurvature(start, end, this.state.curvature, "openclose");
            const path = this.PathComponent(start, end, null, d);
            this.setState({
                tmpPath: path,
            });
        }
        this.setPosWithCursorOut(e);
    }

    componentDidMount() {
        // TODO : import data
        this.load(dummy);
    }

    render () {
        return (
        <div className="drawflow-container">
            {this.state.modalType &&
            <DrawflowModal
                type={this.state.modalType}
                title={MODAL_LABEL[this.state.modalType]}
                close={() => {
                    this.setState({
                        modalType: null,
                    });
                }}
                event={{
                    importData: (data) => {
                        try {
                            this.load(data);
                        }
                        catch{
                            alert("Is not regular format.");
                        }
                    }
                }}
            />
            }
            <div className="drawflow-wrapper">
                <div className="drawflow-node-list">
                    {this.state.nodeList.map((node, idx) =>
                    <div
                        className="drawflow-node-block"
                        key={"drawflow-node-" + idx}
                        draggable
                        onDragStart={e => {
                            this.drag(e, idx);
                        }}
                    >
                        <span>{node.type}</span>
                    </div>)}
                </div>
                <div className="drawflow-main">
                    <div
                        id="drawflow"
                        className="parent-drawflow"
                        onMouseDown={e => {
                            this.setState({
                                canvasDrag: true,
                            });
                            this.unSelect(e);
                        }}
                        onMouseUp={e => {
                            let obj = {
                                tmpPath: null,
                                canvasDrag: false,
                                drag: false,
                            }
                            const { select } = this.state;
                            if(select && select.classList.contains("output")) {
                                obj.select = null;
                            }
                            this.setState(obj);
                        }}
                        onMouseMove={this.onMouseMoveCanvas}
                        onDrop={this.drop}
                        onDragOver={e => {e.preventDefault()}}
                    >
                        <DrawflowAdditionalArea
                            importJson={this.importJson}
                            exportJson={this.exportJson}
                            clear={this.clear}
                            setEditorMode={(lock) => {
                                this.setState({
                                    editLock: lock,
                                })
                            }}
                        />
                        <DrawflowZoomArea
                            zoomIn={this.zoom.in}
                            zoomOut={this.zoom.out}
                            zoomReset={this.zoom.reset}
                        />
                        <div
                            className="drawflow"
                            style={{
                                transform: `translate(${this.state.config.canvasTranslate.x}px, ${this.state.config.canvasTranslate.y}px) scale(${this.state.config.zoom.value})`
                            }}
                            // onMouseUp={e => {}}
                            // onMouseMove={e => {}}
                            // onMouseDown={e => {}}
                            // onContextMenu={e => {}}
                            // onKeyDown={e => {}}
                            // onWheel={e => {}}
                            // onInput={e => {}}
                            // onDoubleClick={e => {}}
                        >
                            {Object.values(this.state.drawflow).map((node, idx) => 
                            <DrawflowNodeBlock
                                key={"drawflow-node-block-" + idx}
                                getCanvasInfo={this.getCanvasInfo}
                                zoom={this.state.config.zoom.value}
                                NodeContent={this.state.nodeList[node.componentIndex].component}
                                params={node.params}
                                ports={this.state.ports}
                                pushPort={(key, port) => {
                                    this.setState({
                                        ports: {
                                            ...this.state.ports,
                                            [key]: port,
                                        }
                                    });
                                }}
                                showButton={this.state.showButton}
                                setShowButton={(nodeId) => {
                                    this.setState({
                                        showButton: nodeId,
                                    });
                                }}
                                event={{
                                    select: this.select,
                                    moveNode: this.moveNode,
                                    createPath: (e, endId, endPort) => {
                                        const { selectId, select } = this.state;
                                        if(selectId === endId) return;
                                        const startPort = this.findIndexByElement(select) + 1;
                                        this.createPath(e, selectId, startPort, endId, endPort);
                                    }
                                }}
                            />
                            )}
                            {Object.entries(this.state.connections).map(([key, connection], idx) => {
                                // key: fromId_portNum_toId_portNum
                                const { ports } = this.state;
                                const arr = key.split("_");
                                const startKey = `${arr[0]}_out_${arr[1]}`;
                                const endKey = `${arr[2]}_in_${arr[3]}`;

                                if(!ports[startKey] || !ports[endKey]) return null;

                                const start = {
                                    x: ports[startKey].x,
                                    y: ports[startKey].y,
                                }
                                const end = {
                                    x: ports[endKey].x,
                                    y: ports[endKey].y,
                                }
                                return (
                                    <svg
                                        key={"drawflow-svg-" + idx}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="drawflow-connection"
                                    >
                                        {this.drawConnections(start, end, connection, idx, key)}
                                    </svg>
                                );
                            })}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="drawflow-connection"
                            >
                                {this.state.tmpPath}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;
