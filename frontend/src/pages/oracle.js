import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import { read, write, event } from '../funcs/blockchain';
import { sleep } from '../funcs/misc';
import { decode } from '../funcs/process';
import reducer from '../states/local';
import { Link } from 'react-router-dom';

import Info from '../components/shared/info';
import List from '../components/shared/list';
import Actions from '../components/actions';

export default ({ match }) => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        contract: '',
        owner: '',
        active: false,
        discoverable: false,
        price: 0,
        completed: 0,
        config: {},
        backlog: [],
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // LOCATE THE DEVICES SMART CONTRACT
            const oracle_address = await read({
                contract: 'oracle',
                func: 'fetch_oracle',
                args: [match.params.hash]
            }, state)

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // CONTRACT ADDRESS
                    contract: oracle_address,

                    // ORACLE OWNER
                    owner: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'owner'
                    }, state),

                    // ACTIVE STATUS
                    active: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'active'
                    }, state),

                    // DISCOVERABLE STATUS
                    discoverable: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'discoverable'
                    }, state),

                    // SERVICE PRICE
                    price: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'price'
                    }, state),

                    // TASK COMPLETED
                    completed: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'completed'
                    }, state),

                    // DISCOVERY CONFIG
                    config: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'config'
                    }, state),

                    // ORACLE BACKLOG
                    backlog: await read({
                        contract: 'oracle',
                        address: oracle_address,
                        func: 'fetch_backlog'
                    }, state)
                }
            })

            return oracle_address
        }

        // FEED CONTAINER
        let feed = null;

        // RUN THE ABOVE, THEN..
        run().then(oracle_address => {
          
            // SUBSCRIBE TO EVENTS IN THE CONTRACT
            feed = event({
                contract: 'oracle',
                address: oracle_address,
                name: 'modification'
            }, state)

            // WHEN EVENT DATA IS INTERCEPTED
            feed.on('data', () => {

                // REFRESH THE ORACLES DETAILS
                run()
            })
        })

        // UNSUBSCRIBE ON UNMOUNT
        return () => { feed.unsubscribe(); }

    // eslint-disable-next-line
    }, [])

    // TOGGLE ACTIVE STATUS
    async function toggle_status(type) {

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // SLEEP FOR A SECOND TO SMOOTHEN TRANSITION
        await sleep(1)

        // TOGGLE ACTIVE STATUS
        const result = await write({
            contract: 'oracle',
            address: local.contract,
            func: 'toggle_' + type
        }, state)

        // IF EVERYTHING WENT FINE
        if (result.success) {
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: type + ' status toggled'
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

    // TOGGLE ACTIVE STATUS
    async function middleware() {

        // SHOW LOADING SCREEN
        dispatch({
            type: 'show-prompt',
            payload: 'loading'
        })

        // SLEEP FOR A SECOND TO SMOOTHEN TRANSITION
        await sleep(1)

        // TOGGLE ACTIVE STATUS
        const result = await write({
            contract: 'oracle',
            address: local.contract,
            func: 'update_middleware'
        }, state)

        // IF EVERYTHING WENT FINE
        if (result.success) {
            dispatch({
                type: 'toast-message',
                payload: {
                    type: 'good',
                    msg: 'sent command to oracle'
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
                header={ 'oracle contract' }
                data={{
                    'Contract': local.contract,
                    'Hash': match.params.hash,
                    'Owner': <Link to={ '/users/' + local.owner }>{ local.owner }</Link>,
                    'Active Status': local.active ? 'True' : 'False',
                    'Discoverable Status': local.discoverable ? 'True' : 'False',
                    'Service Price': local.price,
                    'Tasks Completed': local.completed
                }}
            />
            <Info
                header={ 'discovery configuration' }
                fallback={ 'No parameters found.' }
                data={ decode(local.config) }
            />
            <List
                header={ 'task backlog' }
                data={ local.backlog }
                fallback={ 'No tasks found.' }
                category={ '/tasks' }
            />
            <Actions
                options={{
                    'active': async() => { await toggle_status('active') },
                    'discoverable': async() => { await toggle_status('discoverable') },
                    'modify config': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'modify-config',
                            params: {
                                oracle: local.contract
                            }
                        })
                    },
                    'update middleware': middleware
                }}
            />
        </Fragment>
    )
}