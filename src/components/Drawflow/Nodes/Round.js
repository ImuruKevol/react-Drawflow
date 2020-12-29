import React from 'react';

const Round = (props) => {
    const { type, data } = props;

    return (
    <>
        <div><strong>Type: {type}</strong></div>
        {data.name}
    </>
    );
}

export default Round;
