import React from "react";
import MenuCommonBlock from "./MenuCommonBlock";
import { LIST_TYPE, NODE_MAPPING, RULES } from "../../../common/Enum";

const RuleList = (props) => {
    const { single, threshold, editLock, onDragStart, isIncludeAndSearch } = props;
    return (
        <>
        <div className="drawflow-node-list-category-wrap">
            <div className="drawflow-node-list-category">Single</div>
            <div className="drawflow-node-list-wrap">
                {single.list.slice(0, 3000).map((item, idx) => {
                    const label = `[${10001 + idx}] ${item.name}`;
                    return (
                    isIncludeAndSearch(label) &&
                    <MenuCommonBlock
                        key={"drawflow-sidemenu-block-single-" + idx}
                        label={label}
                        nodeType={NODE_MAPPING[LIST_TYPE.RULE]}
                        idx={idx}
                        menuType={RULES.SINGLE}
                        editLock={editLock}
                        onDragStart={onDragStart}
                    />);
                })}
            </div>
        </div>
        <div className="drawflow-node-list-category-wrap">
            <div className="drawflow-node-list-category">Threshold</div>
            <div className="drawflow-node-list-wrap">
                {threshold.list.slice(0, 3000).map((item, idx) => {
                    const label = `[${10001 + idx}] ${item.name}`;
                    return (
                    isIncludeAndSearch(label) &&
                    <MenuCommonBlock
                        key={"drawflow-sidemenu-block-threshold-" + idx}
                        label={`[${50001 + idx}] ${item.name}`}
                        nodeType={NODE_MAPPING[LIST_TYPE.RULE]}
                        idx={idx}
                        menuType={RULES.THRESHOLD}
                        editLock={editLock}
                        onDragStart={onDragStart}
                    />);
                })}
            </div>
        </div>
    </>
    );
}

export default RuleList;
