import React from "react";
import DrawflowAdditionalArea from "./ButtonArea/DrawflowAdditionalArea";
import DrawflowZoomArea from "./ButtonArea/DrawflowZoomArea";
import DrawflowNodeBlock from "./DrawflowNodeBlock";
import Connection from "./Connection";
import DrawflowModal from "./Modal";
import Nodes from "./Nodes";
import handler from "./drawflowHandler";
import { MODAL_TYPE, MODAL_LABEL, LIST_TYPE } from "../../common/Enum";
import "./style/drawflow.css";

class Drawflow extends React.Component {
    constructor () {
        super();
        this.state = {
            nodeId: 1,
            canvasDrag: false,
            config: {
                drag: false,
                connectionsLabelEnable: false,
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
            connectionsLabel: {},
            ports: {},
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
            newPathDirection: null,
            modalType: null,
        }
        this.tmpPorts = {};
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
        const { config } = this.state;
        if(this.props.editLock) return;
        const pos = handler.getPos(x, y, config.zoom.value);
        this.addNode(nodeType, {in: 1, out: 1}, pos, this.getDataByIndex[type](idx, menuType));
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
        const { select, config } = this.state;
        if(select) select.classList.remove("select");
        this.setState({
            config: {
                ...config,
                drag: false,
            },
            select: null,
            selectId: null,
            selectPoint: null,
            showButton: null,
        });
    }

    select = (e, selectInfo) => {
        e.stopPropagation();
        const { config, select } = this.state;
        if(select) select.classList.remove("select");
        let target = e.currentTarget;
        const isPort = e.target.classList.contains("input") || e.target.classList.contains("output");
        const isNotSeletElement = target.tagName === "circle" || isPort;
        if(!isNotSeletElement)
            target.classList.add("select");
        if(isPort) target = e.target;
        this.setState({
            config: {
                ...config,
                drag: isPort? false : true,
            },
            select: target,
            selectId: selectInfo && !selectInfo.svgKey? selectInfo : null,
            selectPoint: selectInfo && selectInfo.svgKey? selectInfo : null,
        });
    }

    movePoint = (e, svgKey, i) => {
        const { config, select } = this.state;
        if(!config.drag) return;
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
        const { connections, config } = this.state;
        let circles = points.reduce((acc, val, i) => {
            const key = "draw-flow-svg-" + idx + "circle-" + i;
            const property = {
                key,
                style: {
                    cursor: this.props.editLock?"auto":"move",
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
                editLock={this.props.editLock}
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
                editLock={this.props.editLock}
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
        const { config, select } = this.state;
        if(!config.drag) return;
        if(e.currentTarget !== select) return;
        const { movementX, movementY } = e;
        if(movementX === 0 && movementY === 0) return;

        this.movePosition(nodeId, {
            x: movementX,
            y: movementY,
        });
    }

    setPosWithCursorOut = (e) => {
        const { config, selectId, selectPoint } = this.state;
        //* typeof selectId === string -> path
        const exitCond = (!this.state.select || !config.drag) || (!selectId && !selectPoint) || ((typeof selectId) === (typeof ""));
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
        if(this.props.editLock) return;
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
        if(this.props.editLock) return;
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

        const { select } = this.state;
        if(select && select.classList.contains("output")) {
            const { clientX, clientY } = e;

            this.setState({
                newPathDirection: {
                    clientX,
                    clientY,
                },
            });
        }
        this.setPosWithCursorOut(e);
    }

    onMouseDownCanvas = e => {
        if(e.target.id !== "drawflow" && !e.target.classList.contains("drawflow")) return;
        this.setState({
            canvasDrag: true,
        });
        this.unSelect(e);
    }

    onMouseUpCanvas = e => {
        let obj = {
            newPathDirection: null,
            canvasDrag: false,
            config: {
                ...this.state.config,
                drag: false,
            }
        }
        const { select } = this.state;
        if(select && select.classList.contains("output")) {
            obj.select = null;
        }
        this.setState(obj);
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

    onChangeSearchWord = e => {
        this.props.setSearchWord({
            searchWord: e.target.value,
        });
    }

    load = async (data) => {
        const { dataObj } = this.props;
        const { connections } = data;
        if(!dataObj || !connections) return;

        let obj = {
            connections,
            drawflow: data.nodes,
            config: {
                ...this.state.config,
            }
        };

        if(data.connectionsLabel) {
            obj.connectionsLabel = data.connectionsLabel;
            obj.config.connectionsLabelEnable = true;
        }

        const dataKeys = Object.keys(data.nodes).map(key => key*1).sort();
        if(dataKeys.length > 0) {
            obj.nodeId = dataKeys.slice(-1)*1 + 1;
        }

        this.setState({
            ...obj,
        });
    }

    newPath = () => {
        const { select, config, ports, selectId, newPathDirection } = this.state;
        const idx = handler.findIndexByElement(select);
        const startKey = `${selectId}_out_${idx + 1}`;

        if(!ports[startKey]) return null;

        const start = {
            x: ports[startKey].x,
            y: ports[startKey].y,
        }
        const zoom = config.zoom.value;
        const { clientX, clientY } = newPathDirection;
        const end = handler.getPos(clientX, clientY, zoom);
        const d = handler.createCurvature(start, end, "openclose");

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="drawflow-connection"
            >
                <Connection.Path
                    editLock={this.props.editLock}
                    zoom={zoom}
                    start={start}
                    end={end}
                    d={d}
                    select={this.select}
                    setConnections={this.setConnections}
                />
            </svg>
        );
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
        const { drawflow, connections, connectionsLabel, config } = this.state;
        const nodes = Object.entries(drawflow).reduce((acc, [nodeId, data]) => {
            return {
                ...acc,
                [nodeId]: data,
            }
        }, {});
        const exportData = Object.assign({
            nodes,
            connections,
        }, config.connectionsLabelEnable?{connectionsLabel}:{});
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
            newPathDirection: null,
            modalType: null,
        });
    }

    /**
     * @param {Boolean} plag true: zoom in, false: zoom out, null: zoom reset
     */
    zoom = (plag) => {
        const { zoom } = this.state.config;
        const { value, max, min, tick } = zoom;
        let afterZoom = plag? value + tick : value - tick;
        let obj = {
            zoom: {
                ...zoom,
                value: afterZoom,
            }
        }
        if(plag === null) {
            obj.zoom.value = 1;
            obj.canvasTranslate = {
                x: 0,
                y: 0,
            }
        }
        if(afterZoom > max || afterZoom < min) return;
        this.setState({
            config: {
                ...this.state.config,
                ...obj,
            }
        });
    }
/* Button Function Area End */

    render () {
        const nodeBlockEvent = this.props.editLock?
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
                <div className="drawflow-main">
                    <div
                        id="drawflow"
                        className="parent-drawflow"
                        onMouseDown={this.onMouseDownCanvas}
                        onMouseUp={this.onMouseUpCanvas}
                        onMouseMove={this.onMouseMoveCanvas}
                        onDrop={this.drop}
                        onDragOver={e => {e.preventDefault()}}
                    >
                        <DrawflowAdditionalArea
                            importJson={this.importJson}
                            exportJson={this.exportJson}
                            clear={this.clear}
                            editLock={this.props.editLock}
                            setEditorMode={this.props.setEditLock}
                        />
                        {/* deactive */}
                        {/* <DrawflowZoomArea
                            zoomIn={this.zoom(true)}
                            zoomOut={this.zoom(false)}
                            zoomReset={this.zoom(null)}
                        /> */}
                        <div
                            className="drawflow"
                            style={{
                                transform: `translate(${this.state.config.canvasTranslate.x}px, ${this.state.config.canvasTranslate.y}px) scale(${this.state.config.zoom.value})`
                            }}
                        >
                            {Object.values(this.state.drawflow).map((node, idx) => 
                            <DrawflowNodeBlock
                                key={"drawflow-node-block-" + idx}
                                zoom={this.state.config.zoom.value}
                                NodeContent={Nodes[node.type]}
                                params={node}
                                editLock={this.props.editLock}
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
                                const { ports, connectionsLabel, config } = this.state;
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
                                    {config.connectionsLabelEnable &&
                                    <div>
                                        {this.drawConnectionsLabel([start, ...points, end], connectionsLabel[key])}
                                    </div>}
                                </>
                                );
                            })}
                            {this.state.newPathDirection && this.newPath()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Drawflow;
