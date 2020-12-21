import React from "react";

const NodeModal = (props) => {
  const { title, close } = props;

  return (
    <div className="drawflow-modal-content">
      <header className="drawflow-modal-header">
          <strong>{title}</strong>
          <button className="drawflow-modal-close" onClick={close}>X</button>
      </header>
      <div>
        this is single modal.
      </div>
    </div>
  );
}

export default NodeModal;
