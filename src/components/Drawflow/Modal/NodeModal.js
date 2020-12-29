import React from "react";

const NodeModal = (props) => {
  const { title, close, data, setData } = props;
  console.log(data)

  return (
    <div className="drawflow-modal-content">
      <header className="drawflow-modal-header">
          <strong>{title}</strong>
          <button className="drawflow-modal-close" onClick={close}>X</button>
      </header>
      <div>
        this is node modal.<br />
        Name: {data.name}<br />
        Value: {data.value}
      </div>
    </div>
  );
}

export default NodeModal;
