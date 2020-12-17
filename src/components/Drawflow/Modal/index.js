import React from "react";
import ImportModal from "./ImportModal";
import { MODAL_TYPE } from "../../../common/Enum";

const modalMap = {
    [MODAL_TYPE.import]: ImportModal,
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
