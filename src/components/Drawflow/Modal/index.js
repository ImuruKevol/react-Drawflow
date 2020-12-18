import React from "react";
import ImportModal from "./ImportModal";
import NodeModal from "./NodeModal";
import { MODAL_TYPE } from "../../../common/Enum";

const modalMap = {
    [MODAL_TYPE.import]: ImportModal,
    [MODAL_TYPE.node]: NodeModal,
}

const DrawflowModal = (props) => {
    const { type, close, title, event } = props;
    const Component = modalMap[type];
    return (
    <div className="drawflow-modal-container">
        <Component
            title={title}
            close={close}
            {...event}
        />
    </div>
    );
}

export default DrawflowModal;
