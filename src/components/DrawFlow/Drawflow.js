import React from "react";
import DrawflowAdditionalArea from "./DrawflowAdditionalArea";
import DrawflowZoomArea from "./DrawflowZoomArea";
import DrawflowNodeBlock from "./DrawflowNodeBlock";
import Nodes from "./Nodes";
import { createCurvature } from "./drawflowHandler";
import "./beautiful.css";
import "./drawflow.css";
import dummy from "./dummy";

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
            // TODO: unuse state remove
            nodeList: [],
            events: {},
            nodeId: 1,
            ele_selected: null,
            node_selected: null,
            drag: false,

            reroute:true,
            reroute_fix_curvature: false,
            curvature: 0.5,
            reroute_curvature_start_end: 0.5,
            reroute_curvature: 0.5,

            config: {
                circleWidth: 6,
            },

            drag_point: false,

            editor_selected: false,

            connection: false,
            connection_ele: null,
            connection_selected: null,

            canvas_x: 0,
            canvas_y: 0,

            pos_x: 0,
            pos_x_start: 0,
            pos_y: 0,
            pos_y_start: 0,

            mouse_x: 0,
            mouse_y: 0,
            
            line_path: 5,
            first_click: null,
            force_first_input: false,
            draggable_inputs: true,
            select_elements: null,
            canvas: {x: 0, y: 0, width: 0, height: 0},
            drawflow: {},           // {component, params} Array
            connections: {},              // {svg1: [point1, point2, ...], svg2: [...]}
            ports: {},
            editLock: false,
            zoom: {
                value: 1,
                max: 2,
                min: 0.5,
                tick: 0.1,
                lastValue: 1,
            },
            select: null,
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
        console.log(nodeId)
    }

    getPos = (clientX, clientY) => {
        const { canvas } = this.state;
        const { x, y, width, height } = canvas;
        const zoom = this.state.zoom.value;
        return  {
            x: clientX * (width / (width * zoom)) - (x * (width / (width * zoom))),
            y: clientY * (height / (height * zoom)) - (y * (height / (height * zoom))),
        }
    }

    addNodeToDrawFlow = (componentIndex, x, y) => {
        if(this.state.editLock) return;
        const pos = this.getPos(x, y);
        console.debug("drop position");
        console.debug(pos);
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

    PathComponent = (start, end, type, key) => {
        return (
            <path
                key={key}
                xmlns="http://www.w3.org/2000/svg"
                className="main-path"
                d={createCurvature(start, end, this.state.curvature, type)}
                onMouseDown={this.select}
            ></path>
        );
    }

    CircleComponent = (x, y, key) => {
        return (
            <circle
                key={key}
                xmlns="http://www.w3.org/2000/svg"
                className="point"
                cx={x}
                cy={y}
                r={this.state.config.circleWidth}
                onMouseDown={this.select}
                onMouseMove={e => {
                    this.moveNode(e, null, "point");
                }}
            ></circle>
        );
    }

    drawConnections = (start, end, points, idx) => {
        let paths = [this.PathComponent(start, points[0], "open", "draw-flow-svg-" + idx + "path-0")];
        let circles = points.reduce((acc, val, i) => {
            acc.push(this.CircleComponent(val.x, val.y, "draw-flow-svg-" + idx + "circle-" + i));
            return acc;
        }, []);

        for(let i=0;i<points.length - 1;i++) {
            const start = {...points[i]};
            const end = {...points[i+1]};
            paths.push(this.PathComponent(start, end, "openclose", "draw-flow-svg-" + idx + "path-" + (i + 1)));
        }
        paths.push(this.PathComponent(points.slice(-1)[0], end, "close", "draw-flow-svg-" + idx + "path-" + points.length));
        return (
        <>
            {paths.map(comp => comp)}
            {circles.map(comp => comp)}
        </>
        );
    }

    updateConnectionNodes = () => {

    }

    load = (data) => {
        const dataEntries = Object.entries(data.nodes);
        const { connections } = data;
        this.setState({
            connections
        });
        
        let drawflow = {};
        for(const [nodeId, params] of dataEntries) {
            drawflow[nodeId] = this.makeNodeObject(params);
            // I don't understand reroute's role. Then, remove reroute logic.
        }
        this.updateConnectionNodes();

        this.setState({
            drawflow,
        });

        const dataKeys = Object.keys(data.nodes).map(key => key*1).sort();
        if(dataKeys.length > 0) {
            this.setState({
                nodeId: dataKeys.slice(-1)*1 + 1,
            });
        }
    }

    clear = () => {

    }

    zoom = {
        in() {

        },
        out() {

        },
        reset() {

        },
    }

    export = () => {
        const exportData = Object.entries(this.state.drawflow).reduce((acc, val) => {
            const nodeId = val[0];
            const { params } = val[1];
            return Object.assign(acc, {[nodeId]: params});
        }, {});
        console.log(JSON.stringify(exportData, null, 2));
    }

    // TODO: event object로 묶어서 spread로 event 뿌리면 되게 변경하기
    unSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 임시 코드
        if(document.querySelector(".select"))
            document.querySelector(".select").classList.remove("select");
        if(!this.state.select) return;
        this.state.select.classList.remove("select");
        this.setState({
            drag: false,
            select: null,
        });
    }

    select = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(this.state.select) this.state.select.classList.remove("select");
        const { target } = e;
        let element = target;
        if(target.classList.contains("drawflow-node-content")) {
            element = target.parentElement;
        }

        element.classList.add("select");
        this.setState({
            drag: target.classList.contains("input") || target.classList.contains("output")? false : true,
            select: element,
        });
    }

    setDragFalse = () => {
        this.setState({
            drag: false,
        });
    }
    
    getPortListByNodeId = (nodeId) => {
        const { ports } = this.state;
        return Object.keys(ports).filter(key => key.split(/_/g)[0] === "" + nodeId);
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
        this.setState({
            drawflow: {
                ...this.state.drawflow,
                [nodeId]: {
                    ...this.state.drawflow[nodeId],
                    params: {
                        ...this.state.drawflow[nodeId].params,
                        pos: {
                            x: this.state.drawflow[nodeId].params.pos.x + pos.x,
                            y: this.state.drawflow[nodeId].params.pos.y + pos.y,
                        }
                    }
                }
            },
            ports,
        });
    }

    movePoint = (key, pos) => {
        this.setState({
            connections: {
                ...this.state.connections,
                [key]: pos,
            }
        });
    }

    moveNode = (e, nodeId, type = "node") => {
        if(!this.state.drag) return;
        if(e.target !== this.state.select && !e.target.classList.contains("drawflow-node-content")) return;

        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;
        if(type === "node") {
            this.movePosition(nodeId, {
                x: movementX,
                y: movementY,
            });
        }
        else if(type === "point") {
            console.log("move");
        }
    }

    componentDidMount() {
        // TODO: replace querySelector to something.
        const canvas = document.querySelector("#drawflow").querySelector(".drawflow");
        const canvasRect = canvas.getBoundingClientRect();
        this.setState({
            canvas: {
                x: canvasRect.x,
                y: canvasRect.y,
                width: canvas.clientWidth,
                height: canvas.clientHeight,
            }
        }, () => {
            this.load(dummy);
        });
    }

    render () {
        return (
        <div className="drawflow-container">
            <header>
                <h2>Drawflow</h2>
            </header>
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
                        onMouseDown={this.unSelect}
                        onMouseUp={this.setDragFalse}
                        onDrop={this.drop}
                        onDragOver={e => {e.preventDefault()}}
                    >
                        <DrawflowAdditionalArea
                            exportJSON={this.export}
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
                            onMouseUp={e => {}}
                            onMouseMove={e => {}}
                            onMouseDown={e => {}}
                            onContextMenu={e => {}}
                            onKeyDown={e => {}}
                            onWheel={e => {}}
                            onInput={e => {}}
                            onDoubleClick={e => {}}
                        >
                            {Object.values(this.state.drawflow).map((node, idx) => 
                            <DrawflowNodeBlock
                                key={"drawflow-node-block-" + idx}
                                canvas={this.state.canvas}
                                zoom={this.state.zoom.value}
                                NodeContent={this.state.nodeList[node.componentIndex].component}
                                params={node.params}
                                // blockType="common"
                                ports={this.state.ports}
                                pushPort={(key, port) => {
                                    this.setState({
                                        ports: {
                                            ...this.state.ports,
                                            [key]: port,
                                        }
                                    });
                                }}
                                event={{
                                    select: this.select,
                                    moveNode: this.moveNode,
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
                                        {connection.length === 0?
                                            <path
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="main-path"
                                                d={createCurvature(start, end, this.state.curvature, 'openclose')}
                                                onMouseDown={this.select}
                                            ></path>
                                            :
                                            this.drawConnections(start, end, connection, idx)
                                        }
                                    </svg>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;
