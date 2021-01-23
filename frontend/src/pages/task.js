import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import { read, write } from '../funcs/blockchain';
import { sleep } from '../funcs/misc';
import reducer from '../states/local';
import { Link } from 'react-router-dom';

import Info from '../components/shared/info';
import Actions from '../components/actions';

export default ({ match }) => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        creator: '',
        oracle: '',
        reward: '',
        expires: ''
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // ORACLE OWNER
                    creator: await read({
                        contract: 'task',
                        address: match.params.address,
                        func: 'creator'
                    }, state),

                    // ACTIVE STATUS
                    oracle: await read({
                        contract: 'task',
                        address: match.params.address,
                        func: 'oracle'
                    }, state),

                    // DISCOVERABLE STATUS
                    reward: await read({
                        contract: 'task',
                        address: match.params.address,
                        func: 'reward'
                    }, state),

                    // TASK COMPLETED
                    expires: await read({
                        contract: 'task',
                        address: match.params.address,
                        func: 'expires'
                    }, state),
                }
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])

    // RETIRE TASK
    async function retire() {

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // SLEEP FOR A SECOND TO SMOOTHEN TRANSITION
        await sleep(1)

        // TOGGLE ACTIVE STATUS
        const result = await write({
            contract: 'task',
            func: 'retire',
            args: [match.params.address]
        }, state)

        // IF EVERYTHING WENT FINE
        if (result.success) {

            // REDIRECT TO THE TASKS PAGE
            dispatch({
                type: 'redirect',
                payload: '/tasks'
            })

            // CREATE TOAST MESSAGE
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: 'the task has been retired'
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
            <Info
                header={ 'task contract' }
                data={{
                    'Contract': match.params.address,
                    'Creator': <Link to={ '/users/' + local.creator }>{ local.creator }</Link>,
                    'Assigned Oracle': <Link to={ '/oracles/' + local.oracle }>{ local.oracle }</Link>,
                    'Token Reward': local.reward,
                    'Block Expiration': local.expires
                }}
            />
            <Actions
                options={{
                    'retire task': retire
                }}
            />
        </Fragment>
    )
}