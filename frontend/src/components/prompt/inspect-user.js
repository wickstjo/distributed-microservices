import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import '../../interface/css/input.scss';
import { Context } from '../../assets/context';
import reducer from '../../states/input';

import Address from '../input/address';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // INPUT STATE
    const [input, set_input] = useReducer(reducer, {
        address: {
            value: '',
            status: false
        }
    })

    // WHEN A VALID ADDRESS IS INPUT & ENTER IS PRESSED
    useEffect(() => {
        if (state.prompt.visible && input.address.status && state.key_event.key === 'Enter') {

            // REDIRECT TO THE PAGE
            dispatch({
                type: 'redirect',
                payload: '/users/' + input.address.value
            })

            // RESET INPUT FIELDS
            set_input({ type: 'reset' })

            // HIDE THE PROMPT WINDOW
            dispatch({ type: 'hide-prompt' })
        }

    // eslint-disable-next-line
    }, [state.key_event])
    
    return (
        <Fragment>
            <div id={ 'header' }>inspect user</div>
            <div id={ 'container' }>
                <Address
                    data={ input.address }
                    placeholder={ "Provide the user's address" }
                    update={ set_input }
                    id={ 'address' }
                />
            </div>
        </Fragment>
    )
}