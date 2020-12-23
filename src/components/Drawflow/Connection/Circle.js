import React from "react";

const CircleComponent = (props) => {
    const { property, points, svgKey, i, editLock } = props;

    const onMouseDown = (e) => {
        if(editLock) return;
        props.select(e, {
            svgKey,
            i,
        });
    }

    const onMouseMove = e => {
        if(editLock) return;
        props.movePoint(e, svgKey, i);
    }

    const onDoubleClick = () => {
        if(editLock) return;
        const newConnections = points.filter((_, idx) => idx !== i);
        props.setConnections(svgKey, newConnections);
    }

    return (
        <circle
            {...property}
            xmlns="http://www.w3.org/2000/svg"
            className="point"
            r={6}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onDoubleClick={onDoubleClick}
        />
    );
}

export default CircleComponent;
