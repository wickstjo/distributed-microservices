import React from 'react';

export default ({ data }) => { return (
    <div id={ 'info' }>
        { Object.keys(data).map((key, index) =>
            <div id={ 'row' } key={ index }>
                <div>{ key }</div>
                <div>{ data[key] }</div>
            </div>
        )}
    </div>
)}