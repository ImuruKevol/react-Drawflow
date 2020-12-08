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
            nodeBlockList: {},  // {component, params}
            events: {},
            nodeId: 1,
            ele_selected: null,
            node_selected: null,
            drag: false,

            reroute: false,
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
            drawflow: {},
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
                label: val[0],
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

    /**
     * create and add node
     * @param {ReactElement} componentIndex component name
     * @param {{in: Number, out: Number}} port 
     * @param {{x: Number, y: Number }} pos 
     * @param {{}} data 
     */
    addNode = (componentIndex, port, pos, data = {}) => {
        // setState({nodeId, drawflow}) add a params(or other key)
        const { nodeId } = this.state;
        const params = {
            nodeId,
            port,
            pos,
            data,
        };
        console.debug(params);
        this.setState({
            nodeBlockList: {
                ...this.state.nodeBlockList,
                [nodeId]: {
                    component: this.state.nodeList[componentIndex].component,
                    params,
                }
            },
            nodeId: nodeId + 1,
        }, () => {
            console.dir(this.state.nodeBlockList)
            console.dir(this.state.nodeId)
        });
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
        this.addNode(componentIndex, {in: 1, out: 1}, pos);
    }

    addNodeImport = () => {

    }

    addRerouteImport = () => {

    }

    updateConnectionNodes = () => {

    }

    load = () => {
        const { drawflow } = this.state;
        const dataEntries = Object.entries(drawflow);
        
        for(const [key, data] of dataEntries) {
            this.addNodeImport(data);
            if(this.state.reroute) {
                this.addRerouteImport(data);
            }
            this.updateConnectionNodes("node-" + key);
        }
        // for(const [key, data] of dataEntries) {
        //     this.addNodeImport(data);
        // }
        // if(this.state.reroute) {
        //     for(const [key, data] of dataEntries) {
        //         this.addRerouteImport(data);
        //     }
        // }
        // for(const [key, data] of dataEntries) {
        //     this.updateConnectionNodes("node-" + key);
        // }

        const dataKeys = Object.keys(drawflow).map(key => key*1).sort();
        if(dataKeys.length > 0) {
            this.setState({
                nodeId: dataKeys.slice(-1) + 1,
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

    componentDidMount() {
        this.setState({
            reroute: true,
            // drawflow: dummy,
        }, () => {
            this.load();
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
                        <span>{node.label}</span>
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
                            drawflow={this.state.drawflow}
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
                            {Object.entries(this.state.nodeBlockList).map((item, idx) => 
                            <DrawflowNodeBlock
                                key={"drawflow-node-block-" + idx}
                                NodeContent={item[1].component}
                                params={item[1].params}
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