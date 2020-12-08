import React, { useState } from 'react';

const DrawflowAdditionalArea = (props) => {
    const { drawflow, clear, setEditorMode } = props;
    const [lock, setLock] = useState(true);

    const exportData = () => {
        console.log(drawflow);
        console.log(JSON.stringify(drawflow));
    }

    const changeMode = () => {
        setLock(!lock);
        setEditorMode(lock);
    }

    return (
    <div className="drawflow-additional">
        <button className="drawflow-additional-button" onClick={exportData}>Export</button>
        <button className="drawflow-additional-button" onClick={clear}>Clear</button>
        <button className="drawflow-additional-button" onClick={changeMode}>{lock?"UnLock":"Lock"}</button>
    </div>
    );
}

export default DrawflowAdditionalArea;
