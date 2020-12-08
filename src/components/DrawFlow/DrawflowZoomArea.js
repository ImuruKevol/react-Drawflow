import React from 'react';

const DrawflowZoomArea = (props) => {
    const { zoomIn, zoomOut, zoomReset } = props;

    return (
    <div className="drawflow-zoom">
        <span className="drawflow-zoom-button" onClick={zoomIn}>+</span>
        <span className="drawflow-zoom-button" onClick={zoomOut}>-</span>
        <span className="drawflow-zoom-button" onClick={zoomReset}>0</span>
    </div>
    );
}

export default DrawflowZoomArea;
