import React from "react";

const Common = (props) => {
    const { data, setData } = props;

    return (<>
        <strong>{`${data.type?`[${data.type.slice(0, 1)}]`:""}${data.name}`}</strong>
        <div>
            <input
                type="text"
                defaultValue={data.value?data.value:""}
                onKeyDown={e => {
                    e.stopPropagation();
                }}
                onBlur={e => {
                    setData({
                        ...data,
                        value: e.target.value,
                    })
                }}
            />
        </div>
    </>);
}

export default Common;
