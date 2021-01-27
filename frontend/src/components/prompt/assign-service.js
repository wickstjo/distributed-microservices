import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Context } from '../../assets/context';
import { read, write } from '../../funcs/blockchain';

import Info from './info';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // LOCAL STATE
    const [local, set_local] = useState({
        devices: []
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH THE USERS ORACLE COLLECTION
            const collection = await read({
                contract: 'oracle',
                func: 'fetch_collection',
                args: [state.keys.public]
            }, state)

            // SET IN STATE
            set_local({
                devices: collection
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])

    // ASSIGN SERVICE TO ORACLE
    async function assign() {

        // THE ORACLE
        const oracle = local.devices[0];

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // ASSIGN
        const result = await write({
            contract: 'oracle',
            func: 'add_service',
            args: [
                state.prompt.params.service,
                oracle,
                5
            ]
        }, state)

        // EVERYTHING WENT FINE
        if (result.success) {

            // REDIRECT TO THE ORACLES PAGE
            dispatch({
                type: 'redirect',
                payload: '/oracles/' + oracle
            })

            // CREATE TOAST MESSAGE
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: 'service assigned'
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

        // HIDE PROMPT
        dispatch({ type: 'hide-prompt' })
    }
    
    return (
        <Fragment>
            <div id={ 'header' }>assign service to an oracle</div>
            <div id={ 'container' } onClick={ assign }>
                <Info
                    data={{
                        'Service': state.prompt.params.service,
                    }}
                />
            </div>
        </Fragment>
    )
}