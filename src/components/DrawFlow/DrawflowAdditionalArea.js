import React, { useState } from 'react';

const DrawflowAdditionalArea = (props) => {
    const { importJson, exportJson, clear, setEditorMode } = props;
    const [lock, setLock] = useState(true);

    const changeMode = () => {
        setLock(!lock);
        setEditorMode(lock);
    }

    return (
    <div className="drawflow-additional">
        <button className="drawflow-additional-button" onClick={importJson}>Import</button>
        <button className="drawflow-additional-button" onClick={exportJson}>Export</button>
        <button className="drawflow-additional-button" onClick={clear}>Clear</button>
        <button className="drawflow-additional-button" onClick={changeMode}>{lock?"UnLock":"Lock"}</button>
    </div>
    );
}

export default DrawflowAdditionalArea;
