import React from "react";
import DrawflowAdditionalArea from "./DrawflowAdditionalArea";
import DrawflowZoomArea from "./DrawflowZoomArea";
import DrawflowNodeBlock from "./DrawflowNodeBlock";
import Nodes from "./Nodes";
import "./beautiful.css";
import "./drawflow.css";
import dummy from "./dummy";

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
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
            reroute_width: 6,

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
            drawflow: {},           // {component, params} Array
            editLock: false,
            zoom: {
                value: 1,
                max: 2,
                min: 0.5,
                tick: 0.1,
                lastValue: 1,
            }
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
        })
    }

    addNodeToDrawFlow = (componentIndex, x, y) => {
        if(this.state.editLock) return;
        // TODO: replace querySelector to something.
        const canvas = document.querySelector("#drawflow").querySelector(".drawflow");
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        const zoom = this.state.zoom.value;
        const pos = {
            x: x * ( cw / (cw * zoom)) - (canvas.getBoundingClientRect().x * ( cw / (cw * zoom))),
            y: y * ( ch / (ch * zoom)) - (canvas.getBoundingClientRect().y * ( ch / (ch * zoom))),
        }
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
        // console.log(nodeId, componentIndex, params);
        return {
            componentIndex,
            params,
        };
    }

    addRerouteImport = () => {

    }

    updateConnectionNodes = () => {

    }

    load = (data) => {
        const dataEntries = Object.entries(data);
        
        let drawflow = {};
        for(const [nodeId, params] of dataEntries) {
            // TODO: 모아서 한 번에 import
            drawflow[nodeId] = this.makeNodeObject(params);
            if(this.state.reroute) {
                this.addRerouteImport(params);
            }
            this.updateConnectionNodes("node-" + nodeId);
        }
        // for(const [key, params] of dataEntries) {
        //     this.addNodeImport(params);
        // }
        // if(this.state.reroute) {
        //     for(const [key, params] of dataEntries) {
        //         this.addRerouteImport(params);
        //     }
        // }
        // for(const [key, params] of dataEntries) {
        //     this.updateConnectionNodes("node-" + key);
        // }

        this.setState({
            drawflow,
        });

        // const dataKeys = Object.keys(data).map(key => key*1).sort();
        // if(dataKeys.length > 0) {
        //     this.setState({
        //         nodeId: dataKeys.slice(-1) + 1,
        //     });
        // }
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

    componentDidMount() {
        this.load(dummy);
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
                                NodeContent={this.state.nodeList[node.componentIndex].component}
                                params={node.params}
                                // blockType="common"
                            />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;
