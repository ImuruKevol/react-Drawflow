import React, { useState } from "react";

const ImportModal = (props) => {
    const { title, close, importData } = props;
    const [importType, setImportType] = useState(true);
    const [json, setJson] = useState("");

    const getJson = (e) => {
        const { files } = e.target;
        if(files.length === 0) return;
        const file = files[0];
        if(file.name.split(".").slice(-1) !== "json") return;
        const fileReader = new FileReader();
        fileReader.addEventListener("load", e => {
            setJson(e.target.result);
        })
        fileReader.readAsText(file);
    }

    return (
    <div className="drawflow-modal-content">
        <header className="drawflow-modal-header">
            <strong>{title}</strong>
            <button className="drawflow-modal-close" onClick={close}>X</button>
        </header>
        <div style={{marginBottom: "15px"}}>
            <span>
                <label>
                    <input type="radio" name="import-type" defaultChecked={importType} onClick={() => {setImportType(true)}} />
                    import by text
                </label>
            </span>
            <span>
                <label>
                    <input type="radio" name="import-type" defaultChecked={!importType} onClick={() => {setImportType(false)}} />
                    import by json file
                </label>
            </span>
        </div>
        {importType?
        <div>
            <textarea
                style={{
                    width: "100%",
                    height: "200px",
                    resize: "none",
                }}
                defaultValue={json}
                onChange={e => {setJson(e.target.value)}}
            ></textarea>
        </div>
        :
        <div>
            <input type="file" accept=".json" onChange={getJson} />
        </div>
        }
        <div>
            <button
                disabled={json.length === 0}
                onClick={() => {
                try {
                    const data = JSON.parse(json);
                    importData(data);
                }
                catch {
                    alert("Do not parsing to json format.");
                }
            }}>import</button>
        </div>
    </div>
    );
}

export default ImportModal;
