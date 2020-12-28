import React from "react";
import MenuCommonBlock from "./MenuCommonBlock";
import { LIST_TYPE, NODE_MAPPING, RULES } from "../../../common/Enum";

const RuleList = (props) => {
    // TODO : 싱글톤 성능에 따라 isIncludeAndSearch 삭제
    const { single, threshold, editLock, onDragStart, isIncludeAndSearch } = props;
    return (
        <>
        <div className="drawflow-node-list-category-wrap">
            <div className="drawflow-node-list-category">Single</div>
            <div className="drawflow-node-list-wrap">
                {single.list.map((item, idx) => {
                    const label = `[${10001 + idx}] ${item.name}`;
                    return (
                    isIncludeAndSearch(label) &&
                    <MenuCommonBlock
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
                {threshold.list.map((item, idx) => {
                    const label = `[${10001 + idx}] ${item.name}`;
                    return (
                    isIncludeAndSearch(label) &&
                    <MenuCommonBlock
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
