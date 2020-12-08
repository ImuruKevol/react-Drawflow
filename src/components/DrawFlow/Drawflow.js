import React from 'react';
import DrawflowAdditionalArea from './DrawflowAdditionalArea';
import DrawflowZoomArea from './DrawflowZoomArea';
import './beautiful.css';
import './drawflow.css';

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
            nodeList: [
                {label: "Facebook", value: "Facebook"},
                {label: "Slack message", value: "Slack message"},
                {label: "Github Star", value: "Github Star"},
                {label: "AWS", value: "AWS"},
                {label: "File Log", value: "File Log"},
                {label: "Email send", value: "Email send"},
                {label: "Template", value: "Template"},
            ],
            events: {},
            container: document.querySelector("#drawflow"), // 제거 필요
            precanvas: null,
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
            noderegister: {},
            render: null,
            drawflow: { "drawflow": { "Home": { "data": {} }}},

            module: 'Home',
            editor_mode: false,    //editorLock로 바꾸거나 할 것
            zoom: 1,
            zoom_max: 1.6,
            zoom_min: 0.5,
            zoom_value: 0.1,
            zoom_last_value: 1,
        }
    }

    drag = (e, data) => {
        e.dataTransfer.setData("node", data);
    }

    drop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("node");
        this.addNodeToDrawFlow(data, e.clientX, e.clientY);
    }

    addNodeToDrawFlow = (name, x, y) => {
        
    }

    addNodeImport = () => {

    }

    addRerouteImport = () => {

    }

    updateConnectionNodes = () => {

    }

    load = () => {
        if(!this.state.drawflow || !this.state.drawflow.data) return;
        const dataEntries = Object.entries(this.state.drawflow.data);
        // 합치면 안되나? test해볼 것
        for(const [key, data] of dataEntries) {
            this.addNodeImport(data);
        }
        if(this.state.reroute) {
            for(const [key, data] of dataEntries) {
                this.addRerouteImport(data);
            }
        }
        for(const [key, data] of dataEntries) {
            this.updateConnectionNodes('node-' + key);
        }

        const editor = this.state.drawflow;
        const dataKeys = Object.keys(editor.data).map(key => key*1).sort();
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
            drawflow: {},
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
                            this.drag(e, node.value);
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
                                    editor_mode: lock,
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

                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;