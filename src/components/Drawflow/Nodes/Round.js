import React from 'react';

const Round = (props) => {
    const { blockType, data, setData } = props;

    return (
    <>
        <div><strong>{blockType}</strong></div>
        {data.name}
    </>
    );
}

export default Round;
