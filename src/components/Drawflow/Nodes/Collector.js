import React from 'react';

const Collector = (props) => {
    const { data, setData } = props;
    // console.log(data)
    return (<>
        <strong>Collector: 10032</strong>
        <div>
            <input type="text" onKeyDown={e => {
                e.stopPropagation();
            }} />
        </div>
    </>);
}

export default Collector;
