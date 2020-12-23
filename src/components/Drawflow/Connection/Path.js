import React from "react";
import handler from "../drawflowHandler";

const Path = (props) => {
    const { editLock, points, zoom, start, end, svgKey, d } = props;

    const customSort = (arrX, arrY, quadrant) => {
        let result = [];
        let cloneX = [...arrX], cloneY = [...arrY];

        const pop = (popXY) => {
            cloneX = cloneX.filter(item => popXY.x !== item);
            cloneY = cloneY.filter(item => popXY.y !== item);
        }
        const next = () => {
            const result = quadrant === 1 ? {x: Math.min(...cloneX), y: Math.min(...cloneY)}:
                           quadrant === 2 ? {x: Math.max(...cloneX), y: Math.min(...cloneY)}:
                           quadrant === 3 ? {x: Math.max(...cloneX), y: Math.max(...cloneY)}:
                                            {x: Math.min(...cloneX), y: Math.max(...cloneY)};
            pop(result);
            return result;
        }
        while(cloneX.length > 0) {
            result.push(next());
        }
        return result;
    }

    const sortPoints = (points, start, end) => {
        let result = null;
        let arrayX = [];
        let arrayY = [];
        points.reduce((_, val) => {
            arrayX.push(val.x);
            arrayY.push(val.y);
            return null;
        }, null);

        if(start.x <= end.x && start.y <= end.y) {
            // 1 quadrant
            result = customSort(arrayX, arrayY, 1);
        }
        else if(start.x <= end.x && start.y > end.y) {
            // 4 quadrant
            result = customSort(arrayX, arrayY, 4);
        }
        else if(start.x > end.x && start.y <= end.y) {
            // 2 quadrant
            result = customSort(arrayX, arrayY, 2);
        }
        else {  // start.x > end.x && start.y > end.y
            // 3 quadrant
            result = customSort(arrayX, arrayY, 3);
        }

        return result;
    }

    const onMouseDown = e => {
        if(editLock) return;
        props.select(e, svgKey);
    }

    const onDoubleClick = e => {
        if(editLock || !svgKey) return;
        const pos = handler.getPos(e.clientX, e.clientY, zoom);
        const newPoints = sortPoints([...points, pos], start, end);
        props.setConnections(svgKey, newPoints);
    }

    return (
        <path
            xmlns="http://www.w3.org/2000/svg"
            className="main-path"
            d={d}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
        ></path>
    );
}

export default Path;
