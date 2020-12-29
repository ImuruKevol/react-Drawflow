import React, { useState, useEffect } from "react";

const NodeModal = (props) => {
  const { title, close, data, setData } = props;
  const [value, setValue] = useState("");
  console.log(data)

  return (
    <div className="drawflow-modal-content">
      <header className="drawflow-modal-header">
          <strong>{title}</strong>
          <button
            className="drawflow-modal-close"
            onClick={() => {
              close();
              if(data.create) {
                props.deleteNode();
              }
            }}
          >X</button>
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
          const obj = {
            ...data,
            value,
          }
          delete obj.create;
          setData(obj);
          close();
        }}>SAVE</button>
        <button onClick={() => {
          close();
          if(data.create) {
            props.deleteNode();
          }
        }}>CANCEL</button>
      </div>
    </div>
  );
}

export default NodeModal;
