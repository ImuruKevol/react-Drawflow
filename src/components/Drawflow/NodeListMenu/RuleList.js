import React from "react";
import MenuCommonBlock from "./MenuCommonBlock";
import { RULES, NODE_BLOCK_TYPE } from "../../../common/Enum";

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
                        editLock={editLock}
                        onDragStart={e => {
                            onDragStart(e, {
                                nodeType: NODE_BLOCK_TYPE.SINGLE,
                                index: idx,
                                menuType: RULES.SINGLE,
                                modalType: single.modalType
                            });
                        }}
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
                        editLock={editLock}
                        onDragStart={e => {
                            onDragStart(e, {
                                nodeType: NODE_BLOCK_TYPE.THRESHOLD,
                                index: idx,
                                menuType: RULES.THRESHOLD,
                                modalType: threshold.modalType,
                            });
                        }}
                    />);
                })}
            </div>
        </div>
    </>
    );
}

export default RuleList;
