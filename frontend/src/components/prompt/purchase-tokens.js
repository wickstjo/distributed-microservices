import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import '../../interface/css/input.scss';
import { Context } from '../../assets/context';
import reducer from '../../states/input';
import { sleep } from '../../funcs/misc';
import { read, write } from '../../funcs/blockchain';

import Number from '../input/number';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // INPUT STATE
    const [input, set_input] = useReducer(reducer, {
        amount: {
            value: '',
            status: false
        }
    })

    // WHEN A VALID ADDRESS IS INPUT & ENTER IS PRESSED
    useEffect(() => {
        if (state.prompt.visible && input.amount.status && state.key_event.key === 'Enter') {
            purchase()
        }

    // eslint-disable-next-line
    }, [state.key_event])

    // ATTEMPT TO PURCHASE TOKENS 
    async function purchase() {

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // FETCH THE TOKEN PRICE
        const token_price = await read({
            contract: 'token',
            func: 'price',
        }, state)

        // ATTEMPT TO BUY TOKENS
        const result = await write({
            contract: 'token',
            func: 'purchase',
            args: [input.amount.value],
            payable: input.amount.value * token_price
        }, state)

        // SLEEP FOR 2 SECONDS TO SMOOTHEN TRANSITION
        await sleep(2)

        // EVERYTHING WENT FINE
        if (result.success) {

            // CREATE TOAST MESSAGE
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: 'tokens purchased'
                }
            })

        // OTHERWISE, SHOW ERROR
        } else {
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'bad',
                    msg: result.reason
                }
            })
        }

        // HIDE THE PROMPT WINDOW
        dispatch({ type: 'hide-prompt' })
    }
    
    return (
        <Fragment>
            <div id={ 'header' }>purchase tokens</div>
            <div id={ 'container' }>
                <Number
                    data={ input.amount }
                    placeholder={ "How many tokens would you like?" }
                    update={ set_input }
                    id={ 'amount' }
                    range={[1, 500]}
                />
            </div>
        </Fragment>
    )
}