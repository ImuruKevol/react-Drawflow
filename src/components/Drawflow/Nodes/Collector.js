import React from 'react';

const Collector = (props) => {
    return (<>
        <input type="text" onKeyDown={e => {
            e.stopPropagation();
        }} />
    </>);
}

export default Collector;
