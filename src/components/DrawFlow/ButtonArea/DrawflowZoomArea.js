import React from 'react';

const DrawflowZoomArea = (props) => {
    const { zoomIn, zoomOut, zoomReset } = props;

    return (
    <div className="drawflow-zoom">
        <button className="drawflow-zoom-button" onClick={zoomIn}>+</button>
        <button className="drawflow-zoom-button" onClick={zoomOut}>-</button>
        <button className="drawflow-zoom-button" onClick={zoomReset}>reset</button>
    </div>
    );
}

export default DrawflowZoomArea;
