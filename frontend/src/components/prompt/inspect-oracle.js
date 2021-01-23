import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import '../../interface/css/input.scss';
import { Context } from '../../assets/context';
import reducer from '../../states/input';

import Text from '../input/text';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // INPUT STATE
    const [input, set_input] = useReducer(reducer, {
        hash: {
            value: '',
            status: false
        }
    })

    // WHEN A VALID ADDRESS IS INPUT & ENTER IS PRESSED
    useEffect(() => {
        if (state.prompt.visible && input.hash.status && state.key_event.key === 'Enter') {

            // REDIRECT TO THE PAGE
            dispatch({
                type: 'redirect',
                payload: '/oracles/' + input.hash.value
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
            <div id={ 'header' }>inspect oracle</div>
            <div id={ 'container' }>
                <Text
                    data={ input.hash }
                    placeholder={ "Provide the oracle's hash identifier" }
                    range={[ 64, 64 ]}
                    update={ set_input }
                    id={ 'hash' }
                />
            </div>
        </Fragment>
    )
}