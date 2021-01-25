import React, { useContext, useEffect, useReducer, Fragment } from 'react';
import { Context } from '../assets/context';
import { read, event } from '../funcs/blockchain';
import reducer from '../states/local';

import Info from '../components/shared/info';
import List from '../components/shared/list';
import Actions from '../components/actions';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATES
    const [local, set_local] = useReducer(reducer, {
        initialized: false,
        services: []
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
                        contract: 'service',
                        func: 'initialized'
                    }, state),

                    // FETCH SERVICES
                    services: await read({
                        contract: 'service',
                        func: 'fetch_services'
                    }, state),
                }
            })
        }

        // RUN THE ABOVE
        run()

        // SUBSCRIBE TO EVENTS IN THE CONTRACT
        const feed = event({
            contract: 'service',
            name: 'added'
        }, state)
        
        // WHEN EVENT DATA IS INTERCEPTED
        feed.on('data', async() => {

            // REFRESH DEVICE COLLECTION
            set_local({
                type: 'partial',
                payload: {
                    services: await read({
                        contract: 'service',
                        func: 'fetch_services'
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
                header={ 'Service Manager' }
                data={{
                    'Contract': state.contracts.managers.service._address,
                    'Initialized': local.initialized ? 'True' : 'False'
                }}
            />
            <List
                header={ 'list of services' }
                fallback={ 'No services found.' }
                data={ local.services }
                category={ '/services' }
            />
            <Actions
                options={{
                    'create service': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'import-service'
                        })
                    },
                    'inspect service': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'inspect-service'
                        })
                    }
                }}
            />
        </Fragment>
    )
}