import React, { useContext, useEffect } from 'react';
import { Context } from '../../assets/context';

export default ({ data, placeholder, update, id }) => {

    // GLOBAL STATE
    const { state } = useContext(Context);

    // ON LOAD..
    useEffect(() => {

        // VALIDATE DATA
        validate(data.value);

    // eslint-disable-next-line
    }, [])

    // VALIDATE USER INPUT
    function validate(input) {

        // PERFORM CHECK
        const result = state.web3.utils.isAddress(input);

        // UPDATE PARENT STATE
        update({
            type: 'field',
            payload: {
                name: id,
                value: {
                    value: input,
                    status: result
                }
            }
        })
    }

    return (
        <div id={ 'field' }>
            <input
                type={ 'text' }
                className={ data.status ? 'good-input' : 'bad-input' }
                placeholder={ placeholder }
                value={ data.value }
                onChange={ event => { validate(event.target.value) }}
            />
        </div>
    )
}