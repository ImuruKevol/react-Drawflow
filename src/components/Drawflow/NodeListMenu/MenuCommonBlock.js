import React from "react";

const MenuCommonBlock = (props) => {
    const { label, editLock, onDragStart } = props;

    return (
    <div
        className="drawflow-node-block"
        draggable={!editLock}
        onDragStart={onDragStart}
    >
        <span title={label}>{label}</span>
    </div>
    );
}

export default MenuCommonBlock;
