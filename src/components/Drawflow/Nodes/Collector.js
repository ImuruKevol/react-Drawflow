import React, { useState } from 'react';

const Collector = (props) => {
    const { data, setData } = props;

    return (<>
        <strong>Collector: 10032</strong>
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

export default Collector;
