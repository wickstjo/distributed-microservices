import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import { read, event } from '../funcs/blockchain';
import reducer from '../states/local';

import Info from '../components/shared/info';
import List from '../components/shared/list';
import Actions from '../components/actions';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        initialized: false,
        collection: []
    })
    
    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {
                    
                    // INIT VALUE
                    initialized: await read({
                        contract: 'oracle',
                        func: 'initialized'
                    }, state),

                    // USER ORACLE COLLECTION
                    collection: await read({
                        contract: 'oracle',
                        func: 'fetch_collection',
                        args: [state.keys.public]
                    }, state)
                }
            })
        }

        // RUN THE ABOVE
        run()

        // SUBSCRIBE TO EVENTS IN THE CONTRACT
        const feed = event({
            contract: 'oracle',
            name: 'added'
        }, state)
        
        // WHEN EVENT DATA IS INTERCEPTED
        feed.on('data', async() => {

            // REFRESH DEVICE COLLECTION
            set_local({
                type: 'partial',
                payload: {
                    collection: await read({
                        contract: 'oracle',
                        func: 'fetch_collection',
                        args: [state.keys.public]
                    }, state)
                }
            })
        })

        // UNSUBSCRIBE ON UNMOUNT
        return () => { feed.unsubscribe(); }

    // eslint-disable-next-line
    }, [])

    return (
        <Fragment>
            <Info
                header={ 'Oracle Manager' }
                data={{
                    'Contract': state.contracts.managers.oracle._address,
                    'Initialized': local.initialized ? 'True' : 'False'
                }}
            />
            <List
                header={ 'Your Oracles' }
                data={ local.collection }
                fallback={ 'No oracles found.' }
                category={ '/oracles' }
            />
            <Actions
                options={{
                    'create oracle': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'import-oracle'
                        })
                    },
                    'discover oracle': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'discover-oracle'
                        })
                    },
                    'inspect oracle': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'inspect-oracle'
                        })
                    }
                }}
            />
        </Fragment>
    )
}