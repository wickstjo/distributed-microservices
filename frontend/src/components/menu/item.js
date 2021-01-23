import React from 'react';
import { Link } from 'react-router-dom';

export default ({ link, header }) => { return (
    <Link to={ link }>
        <li>{ header }</li>
    </Link>
)}