import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Context } from '../assets/context';
import { read, write } from '../funcs/blockchain';
import { sleep } from '../funcs/misc';

import Info from '../components/shared/info';
import Actions from '../components/actions';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useState({
        initialized: false
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({

                // INIT VALUE
                initialized: await read({
                    contract: 'user',
                    func: 'initialized'
                }, state)
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])


    // CREATE ACCOUNT FUNCTION
    async function create_account() {

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // CREATE THE USER
        const result = await write({
            contract: 'user',
            func: 'create'
        }, state)

        // SLEEP FOR A SECOND TO SMOOTHEN THE PROCESS
        await sleep(1)

        // HIDE LOADING SCREEN
        dispatch({ type: 'hide-prompt' })

        // EVERYTHING WENT FINE
        if (result.success) {

            // REDIRECT TO THE USER PAGE
            dispatch({
                type: 'redirect',
                payload: '/users/' + state.keys.public
            })

            // SET LOGIN IN STATE
            dispatch({
                type: 'verify',
                payload: true
            })

            // CREATE TOAST MESSAGE
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: 'account created'
                }
            })

        // OTHERWISE, SHOW ERROR
        } else {

            // CREATE TOAST MESSAGE
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'bad',
                    msg: result.reason
                }
            })
        }
    }
    
    return (
        <Fragment>
            <Info
                header={ 'User Manager' }
                data={{
                    'Contract': state.contracts.managers.user._address,
                    'Initialized': local.initialized ? 'True' : 'False'
                }}
            />
            <Actions
                options={{
                    'create account': create_account,
                    'inspect user': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'inspect-user'
                        })
                    }
                }}
            />
        </Fragment>
    )
}