import React from "react";
import DrawflowAdditionalArea from "./ButtonArea/DrawflowAdditionalArea";
import DrawflowZoomArea from "./ButtonArea/DrawflowZoomArea";
import DrawflowNodeBlock from "./DrawflowNodeBlock";
import Connection from "./Connection";
import DrawflowModal from "./Modal";
import Nodes from "./Nodes";
import handler from "./drawflowHandler";
import { MODAL_TYPE, MODAL_LABEL, LIST_TYPE, NODE_MAPPING } from "../../common/Enum";
import "./style/drawflow.css";

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
            nodeId: 1,
            drag: false,                // TODO: move config
            canvasDrag: false,          // TODO: move config
            config: {
                canvasTranslate: {
                    x: 0,
                    y: 0,
                },
                zoom: {
                    value: 1,
                    max: 2,
                    min: 0.5,
                    tick: 0.1,
                },
            },
            drawflow: {},
            connections: {},
            connectionsLabelEnable: false,  // TODO: move config
            connectionsLabel: {},
            ports: {},
            editLock: false,                // TODO: move config
            select: null,                   // TODO: move select(new object state)
            selectId: null,                 // TODO: move select(new object state)
            selectPoint: null,              // TODO: move select(new object state)
            showButton: null,
            tmpPath: null,
            modalType: null,
            searchWord: "",
        }
        this.tmpPorts = {};
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

    /**
     * create and add node
     * @param {String} nodeType
     * @param {{in: Number, out: Number}} port 
     * @param {{x: Number, y: Number }} pos 
     * @param {{}} data 
     */
    addNode = (nodeType, port, pos, data = {}) => {
        const { nodeId, drawflow } = this.state;
        const params = {
            id: nodeId,
            type: nodeType,
            data,
            port,
            connections: this.makePortObj(port),
            pos: {
                x: pos.x,
                y: pos.y,
            },
        };
        this.setState({
            nodeId: nodeId + 1,
            drawflow: {
                ...drawflow,
                [nodeId]: {...params},
            }
        });
    }

    getDataByIndex = {
        [LIST_TYPE.FILTER]: (idx) => {
            return this.props.dataObj.list[idx];
        },
        [LIST_TYPE.RULE]: (idx, type) => {
            return this.props.dataObj[type].list[idx];
        },
    }

    addNodeToDrawFlow = (nodeType, x, y, idx, menuType) => {
        const { type } = this.props;
        const { editLock, config } = this.state;
        if(editLock) return;
        const pos = handler.getPos(x, y, config.zoom.value);
        this.addNode(nodeType, {in: 1, out: 1}, pos, this.getDataByIndex[type](idx, menuType));
    }

    drag = (e, nodeType, idx, menuType) => {
        e.dataTransfer.setData("nodeType", nodeType);
        e.dataTransfer.setData("index", idx);
        if(menuType) e.dataTransfer.setData("menuType", menuType);
    }

    drop = (e) => {
        e.preventDefault();
        const nodeType = e.dataTransfer.getData("nodeType");
        const idx = e.dataTransfer.getData("index");
        const menuType = e.dataTransfer.getData("menuType");
        this.addNodeToDrawFlow(nodeType, e.clientX, e.clientY, idx, menuType);
    }

    unSelect = (e) => {
        e.stopPropagation();
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
        e.stopPropagation();
        const { select } = this.state;
        if(select) select.classList.remove("select");
        let target = e.currentTarget;
        const isPort = e.target.classList.contains("input") || e.target.classList.contains("output");
        const isNotSeletElement = target.tagName === "circle" || isPort;
        if(!isNotSeletElement)
            target.classList.add("select");
        if(isPort) target = e.target;
        this.setState({
            drag: isPort? false : true,
            select: target,
            selectId: selectInfo && !selectInfo.svgKey? selectInfo : null,
            selectPoint: selectInfo && selectInfo.svgKey? selectInfo : null,
        });
    }

    movePoint = (e, svgKey, i) => {
        const { drag, select } = this.state;
        if(!drag) return;
        if(e.target !== select) return;
        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;
        
        const { connections } = this.state;
        const oldPos = connections[svgKey][i];
        const after = {
            x: oldPos.x + movementX,
            y: oldPos.y + movementY,
        }
        let clone = [...connections[svgKey]];
        clone[i] = after;
        this.setState({
            connections: {
                ...connections,
                [svgKey]: clone,
            }
        });
    }

    setConnections = (svgKey, newConnections) => {
        const { connections } = this.state;
        this.setState({
            connections: {
                ...connections,
                [svgKey]: newConnections,
            }
        });
    }

    drawConnections = (start, end, points, idx, svgKey) => {
        const { connections, editLock, config } = this.state;
        let circles = points.reduce((acc, val, i) => {
            const key = "draw-flow-svg-" + idx + "circle-" + i;
            const property = {
                key,
                style: {
                    cursor: editLock?"auto":"move",
                },
                cx: val.x,
                cy: val.y,
            }
            acc.push(
            <Connection.Circle
                property={property}
                points={connections[svgKey]}
                svgKey={svgKey}
                i={i}
                editLock={editLock}
                select={this.select}
                movePoint={this.movePoint}
                setConnections={this.setConnections}
            />);
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
                return acc + handler.createCurvature(val.start, val.end, val.type) + " ";
            }, "");
        }
        else {
            d = handler.createCurvature(start, end, "openclose");
        }

        return (
        <>
            <Connection.Path
                editLock={editLock}
                points={connections[svgKey]}
                zoom={config.zoom.value}
                start={start}
                end={end}
                svgKey={svgKey}
                d={d}
                select={this.select}
                setConnections={this.setConnections}
            />
            {circles.map(comp => comp)}
        </>
        );
    }

    // TODO : label div size에 따라 위치 조정 필요
    // TODO : style(z-index, border, background, etc...) 조정 필요
    drawConnectionsLabel = (points, label) => {
        // calc label position
        const pointsLength = points.length;
        const mid = Math.floor(pointsLength / 2);
        let pos = {};
        if(pointsLength % 2 === 1) {
            pos = points[mid];
        }
        else {      // even
            const start = points[mid - 1];
            const end = points[mid];
            pos = {
                x: Math.abs(end.x + start.x) / 2,
                y: Math.abs(end.y + start.y) / 2,
            }
        }

        return (
        <div
            style={{
                position: "absolute",
                top: pos.y,
                left: pos.x,
                border: "1px solid red"
            }}
        >
            {label}
        </div>);
    }
    
    getPortListByNodeId = (nodeId) => {
        const { ports } = this.state;
        return Object.keys(ports).filter(key => key.split(/_/g)[0] === "" + nodeId);
    }

    setPosByNodeId = (nodeId, pos, ports) => {
        const { drawflow } = this.state;
        this.setState({
            drawflow: {
                ...drawflow,
                [nodeId]: {
                    ...drawflow[nodeId],
                    pos: {
                        x: pos.x,
                        y: pos.y,
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
            x: this.state.drawflow[nodeId].pos.x + pos.x,
            y: this.state.drawflow[nodeId].pos.y + pos.y,
        }
        this.setPosByNodeId(nodeId, tmpPos, ports);
    }

    moveNode = (e, nodeId) => {
        const { drag, select } = this.state;
        if(!drag) return;
        if(e.currentTarget !== select) return;
        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;

        this.movePosition(nodeId, {
            x: movementX,
            y: movementY,
        });
    }

    setPosWithCursorOut = (e) => {
        const { drag, selectId, selectPoint, config} = this.state;
        // typeof selectId === string -> path
        const exitCond = (!this.state.select || !drag) || (!selectId && !selectPoint) || ((typeof selectId) === (typeof ""));
        if(exitCond) return;

        const mousePos = handler.getPos(e.clientX, e.clientY, config.zoom.value);
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

    moveCanvas = (e) => {
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

    nodeDelete = () => {
        if(this.state.editLock) return;
        const { connections, drawflow, ports, selectId } = this.state;
        if(!selectId) return;
        let obj = {
            connections: {...connections},
            ports: {...ports},
            drawflow: {...drawflow},
        }
        // 1. find in connections
        Object.keys(obj.connections).reduce((_, val) => {
            const arr = val.split("_");
            if(arr[0]*1 === selectId || arr[2]*1 === selectId) {
                delete obj.connections[val];
            }
            return null;
        }, null);
        // 2. find in ports
        Object.keys(obj.ports).reduce((_, val) => {
            const arr = val.split("_");
            if(arr[0]*1 === selectId) {
                delete obj.ports[val];
            }
            return null;
        }, null);
        // 3. find in drawflow
        delete obj.drawflow[selectId];
        // 4. state clear
        obj = {
            ...obj,
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
        }
        // 4. set state
        this.setState(obj);
    }

    pathDelete = () => {
        if(this.state.editLock) return;
        const { selectId, connections } = this.state;
        let newConnections = {...connections};
        delete newConnections[selectId];
        this.setState({
            connections: newConnections,
        });
    }

    pushPorts = (ports) => {
        this.tmpPorts = {
            ...this.tmpPorts,
            ...this.state.ports,
            ...ports,
        }
        this.setState({
            ports: {
                ...this.state.ports,
                ...this.tmpPorts,
            }
        });
    }

    onMouseMoveCanvas = (e) => {
        const { canvasDrag } = this.state;
        if(canvasDrag) this.moveCanvas(e);

        const { select, config, editLock } = this.state;
        if(select && select.classList.contains("output")) {
            const { clientX, clientY } = e;
            const idx = handler.findIndexByElement(select);
            const { ports, selectId } = this.state;
            const startKey = `${selectId}_out_${idx + 1}`;

            if(!ports[startKey]) return null;

            const start = {
                x: ports[startKey].x,
                y: ports[startKey].y,
            }
            const end = handler.getPos(clientX, clientY, config.zoom.value);

            const d = handler.createCurvature(start, end, "openclose");
            const path = (
                <Connection.Path
                    editLock={editLock}
                    zoom={config.zoom.value}
                    start={start}
                    end={end}
                    d={d}
                    select={this.select}
                    setConnections={this.setConnections}
                />
            );

            this.setState({
                tmpPath: path,
            });
        }
        this.setPosWithCursorOut(e);
    }

    onKeyDown = (e) => {
        if(e.key === "Delete"){
            const { select } = this.state;
            if(select && select.tagName === "path") {
                this.pathDelete();
            }
            else {
                this.nodeDelete();
            }
        }
    }

    isInludeAndSearch = (target) => {
        const { searchWord } = this.state;
        // const arr = this.searchWord.toLowerCase().split(" ").filter(item => item.length > 0);
        const arr = searchWord.toLowerCase().split(" ").filter(item => item.length > 0);
        return arr.filter(word => target.toLowerCase().includes(word)).length === arr.length;
    }
    
    // TODO : 파일로 분리
    NodeListMenuComponent = (label, nodeType, idx, menuType = undefined) => {
        const style = this.isInludeAndSearch(label)?{}:{display: "none"};
        return (
            <div
                className="drawflow-node-block"
                style={style}
                key={"drawflow-node-" + idx}
                draggable={!this.state.editLock}
                onDragStart={e => {
                    this.drag(e, nodeType, idx, menuType);
                }}
            >
                <span title={label}>{label}</span>
            </div>
        );
    }

    onScrollNodeList = e => {
        if(!this.props.infinityScroll) return;
        
        const { searchWord } = this.state;
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        const scroll = scrollHeight - scrollTop;
        if(scroll === clientHeight) {
            this.props.getDataByScroll();
        }
    }

    // TODO : 파일로 분리
    NodeListMenu = {
        [LIST_TYPE.FILTER]: () => {
            const { dataObj } = this.props;
            if(!dataObj) return;
            const { list } = dataObj;
            if(!list) return <></>;
            return (
            <div
                className="drawflow-node-list-wrap"
                onScroll={this.onScrollNodeList}
            >
                {list.map((item, idx) => this.NodeListMenuComponent(`[${item.type.slice(0, 1)}] ${item.name}`, NODE_MAPPING[LIST_TYPE.FILTER], idx))}
            </div>
            );
        },

        // TODO : infinity scroll
        [LIST_TYPE.RULE]: () => {
            const { dataObj } = this.props;
            if(!dataObj) return;
            const { single, threshold } = dataObj;
            return (
            <>
                <div className="drawflow-node-list-category-wrap">
                    <div className="drawflow-node-list-category">Single</div>
                    <div className="drawflow-node-list-wrap">
                        {single.list.map((item, idx) => this.NodeListMenuComponent(`${item.name}`, NODE_MAPPING[LIST_TYPE.RULE], idx, "single"))}
                    </div>
                </div>
                <div className="drawflow-node-list-category-wrap">
                    <div className="drawflow-node-list-category">Threshold</div>
                    <div className="drawflow-node-list-wrap">
                        {threshold.list.map((item, idx) => this.NodeListMenuComponent(`${item.name}`, NODE_MAPPING[LIST_TYPE.RULE], idx, "threshold"))}
                    </div>
                </div>
            </>
            );
        },
    }

    onChangeSearchWord = e => {
        // this.props.clearCurrent();
        this.setState({
            searchWord: e.target.value,
        }, () => {
            // TODO : LIST_TYPE.RULE
            // const { searchWord } = this.state;
            // this.props.getDataByScroll(searchWord);
        });
    }

    load = async (data) => {
        const { dataObj } = this.props;
        const { connections } = data;
        if(!dataObj || !connections) return;

        let obj = {
            connections,
            data: {...dataObj},
            drawflow: data.nodes,
        };

        if(data.connectionsLabel) {
            obj.connectionsLabel = data.connectionsLabel;
            obj.connectionsLabelEnable = true;
        }

        const dataKeys = Object.keys(data.nodes).map(key => key*1).sort();
        if(dataKeys.length > 0) {
            obj.nodeId = dataKeys.slice(-1)*1 + 1;
        }

        this.setState({
            ...obj,
        });
    }

/* Life Cycle Function Start */
    componentDidMount() {
        if(this.props.canvasData) {
            this.load(this.props.canvasData);
            document.addEventListener("keydown", this.onKeyDown);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }
/* Life Cycle Function End */

/* Button Function Area Start */
    importJson = () => {
        this.setState({
            modalType: MODAL_TYPE.import,
        });
    }

    exportJson = () => {
        const { drawflow, connections, connectionsLabel, connectionsLabelEnable } = this.state;
        const nodes = Object.entries(drawflow).reduce((acc, [nodeId, data]) => {
            return {
                ...acc,
                [nodeId]: data,
            }
        }, {});
        const exportData = Object.assign({
            nodes,
            connections,
        }, connectionsLabelEnable?{connectionsLabel}:{});
        if(!navigator.clipboard || !navigator.clipboard.writeText){
            alert("clipboard api를 지원하지 않는 브라우저입니다.");
            return;
        }
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)).then(() => {
            alert("json 데이터가 클립보드에 저장되었습니다.");
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

    canvasLock = (lock) => {
        this.setState({
            editLock: lock,
        });
    }

    zoom = {
        in: () => {
            const { zoom } = this.state.config;
            const { value, max, tick } = zoom;
            if(value >= max) return;
            this.setState({
                config: {
                    ...this.state.config,
                    zoom: {
                        ...zoom,
                        value: value + tick,
                    }
                }
            });
        },
        out: () => {
            const { zoom } = this.state.config;
            const { value, min, tick } = zoom;
            if(value <= min) return;
            this.setState({
                config: {
                    ...this.state.config,
                    zoom: {
                        ...zoom,
                        value: value - tick,
                    }
                }
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
/* Button Function Area End */

    render () {
        const nodeBlockEvent = this.state.editLock?
        {
            select: () => {},
            moveNode: () => {},
            createPath: () => {},
            nodeDelete: () => {},
            setData: () => {},
        }
        :
        {
            select: this.select,
            moveNode: this.moveNode,
            createPath: (e, endId, endPort) => {
                const { selectId, select } = this.state;
                if(selectId === endId) return;
                const startPort = handler.findIndexByElement(select) + 1;
                this.createPath(e, selectId, startPort, endId, endPort);
            },
            nodeDelete: this.nodeDelete,
            setData: (nodeId, data) => {
                const { drawflow } = this.state;
                this.setState({
                    drawflow: {
                        ...drawflow,
                        [nodeId]: {
                            ...drawflow[nodeId],
                            data: data,
                        }
                    }
                });
            },
        };

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
                    <div className="drawflow-node-list-search">
                        <input
                            type="text"
                            // value={this.state.searchWord}
                            placeholder="space: and"
                            onChange={this.onChangeSearchWord}
                        />
                        {this.props.infinityScroll && <button>검색</button>}
                    </div>
                    <div className="drawflow-node-list-flex">
                        {this.NodeListMenu[this.props.type]()}
                    </div>
                </div>
                <div className="drawflow-main">
                    <div
                        id="drawflow"
                        className="parent-drawflow"
                        onMouseDown={e => {
                            if(e.target.id !== "drawflow" && !e.target.classList.contains("drawflow")) return;
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
                            editLock={this.state.editLock}
                            setEditorMode={this.canvasLock}
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
                                zoom={this.state.config.zoom.value}
                                NodeContent={Nodes[node.type]}
                                params={node}
                                editLock={this.state.editLock}
                                ports={this.state.ports}
                                pushPorts={this.pushPorts}
                                showButton={this.state.showButton}
                                setShowButton={(nodeId) => {
                                    this.setState({
                                        showButton: nodeId,
                                    });
                                }}
                                showModal={(type) => {
                                    this.setState({
                                        modalType: type,
                                    });
                                }}
                                event={nodeBlockEvent}
                            />
                            )}
                            {Object.entries(this.state.connections).map(([key, points], idx) => {
                                // key: fromId_portNum_toId_portNum
                                const { ports, connectionsLabel, connectionsLabelEnable } = this.state;
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
                                <>
                                    <svg
                                        key={"drawflow-svg-" + idx}
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="drawflow-connection"
                                    >
                                        {this.drawConnections(start, end, points, idx, key)}
                                    </svg>
                                    {connectionsLabelEnable &&
                                    <div>
                                        {this.drawConnectionsLabel([start, ...points, end], connectionsLabel[key])}
                                    </div>}
                                </>
                                );
                            })}
                            {this.state.tmpPath &&
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="drawflow-connection"
                                >
                                    {this.state.tmpPath}
                                </svg>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;
