import React from 'react';

export default ({ header, func }) => { return (
    <li onClick={ func }>{ header }</li>
)}