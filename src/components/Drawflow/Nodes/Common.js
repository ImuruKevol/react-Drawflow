import React from "react";

const Common = (props) => {
    const { data } = props;

    return (
    <>
        <strong>{`${data.type?`[${data.type.slice(0, 1)}]`:""}${data.name}`}</strong>
        <div>{data.value}</div>
    </>);
}

export default Common;
