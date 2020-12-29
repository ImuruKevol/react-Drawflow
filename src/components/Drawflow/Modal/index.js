import React from "react";
import ImportModal from "./ImportModal";
import NodeModal from "./NodeModal";
import SingleModal from "./SingleModal";
import ThresholdModal from "./ThresholdModal";
import { MODAL_TYPE } from "../../../common/Enum";

const modalMap = {
    [MODAL_TYPE.import]: ImportModal,
    [MODAL_TYPE.common]: NodeModal,
    [MODAL_TYPE.single]: SingleModal,
    [MODAL_TYPE.threshold]: ThresholdModal,
}

const DrawflowModal = (props) => {
    const { type, close, title, data, setData, event } = props;
    const Component = modalMap[type];
    return (
    <div className="drawflow-modal-container">
        <Component
            title={title}
            close={close}
            data={data}
            setData={setData}
            {...event}
        />
    </div>
    );
}

export default DrawflowModal;
