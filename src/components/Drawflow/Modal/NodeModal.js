import React, { useState } from "react";

const NodeModal = (props) => {
  const { title, close, data, setData } = props;
  const [value, setValue] = useState("");
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
        <div>
            <input
                type="text"
                defaultValue={data.value?data.value:""}
                onKeyDown={e => {
                    e.stopPropagation();
                }}
                onChange={e => {
                  setValue(e.target.value);
                }}
            />
        </div>
        <button onClick={() => {
          setData({
            ...data,
            value: value,
          });
          close();
        }}>SAVE</button>
      </div>
    </div>
  );
}

export default NodeModal;
