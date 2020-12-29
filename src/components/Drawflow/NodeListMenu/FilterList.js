import React from "react";
import MenuCommonBlock from "./MenuCommonBlock";
import { NODE_BLOCK_TYPE } from "../../../common/Enum";

const FilterList = (props) => {
    const { filterObj, editLock, onDragStart, isIncludeAndSearch } = props;

    return (
    <div
        className="drawflow-node-list-wrap"
    >
        {filterObj.list.map((item, idx) => {
            const label = `[${item.type.slice(0, 1)}] ${item.name}`;
            return (
            isIncludeAndSearch(label) &&
            <MenuCommonBlock
                key={"drawflow-sidemenu-block-" + idx}
                label={label}
                editLock={editLock}
                onDragStart={e => {
                    onDragStart(e, {
                        nodeType: NODE_BLOCK_TYPE.FILTER,
                        index: idx,
                        modalType: filterObj.modalType,
                    });
                }}
            />);
        })}
    </div>
    );
}

export default FilterList;
