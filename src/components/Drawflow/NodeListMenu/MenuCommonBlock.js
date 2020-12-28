import React from "react";

const MenuCommonBlock = (props) => {
    const { label, nodeType, idx, menuType, editLock, onDragStart } = props;

    return (
    <div
        className="drawflow-node-block"
        draggable={!editLock}
        onDragStart={e => {
            onDragStart(e, nodeType, idx, menuType);
        }}
    >
        <span title={label}>{label}</span>
    </div>
    );
}

export default MenuCommonBlock;
