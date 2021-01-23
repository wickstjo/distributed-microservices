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
        fee: 0,
        pending: [],
        completed: []
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
                        contract: 'task',
                        func: 'initialized'
                    }, state),

                    // TOKEN FEE FOR TASKS
                    fee: await read({
                        contract: 'task',
                        func: 'fee'
                    }, state)
                }
            })

            // FETCH PENDING & COMPLETED TASKS
            const tasks = await read({
                contract: 'task',
                func: 'fetch_lists',
                args: [state.keys.public]
            }, state)

            // SET BOTH IN STATE
            set_local({
                type: 'partial',
                payload: {
                    pending: tasks[0],
                    completed: tasks[1]
                }
            })
        }

        // RUN THE ABOVE
        run()
          
        // SUBSCRIBE TO EVENTS IN THE CONTRACT
        const feed = event({
            contract: 'task',
            name: 'modification'
        }, state)

        // WHEN EVENT DATA IS INTERCEPTED
        feed.on('data', async() => {

            // FETCH PENDING & COMPLETED TASKS
            const tasks = await read({
                contract: 'task',
                func: 'fetch_lists',
                args: [state.keys.public]
            }, state)

            // SET BOTH IN STATE
            set_local({
                type: 'partial',
                payload: {
                    pending: tasks[0],
                    completed: tasks[1]
                }
            })
        })

        // UNSUBSCRIBE ON UNMOUNT
        return () => { feed.unsubscribe(); }

    // eslint-disable-next-line
    }, [])

    // SHOW RESULT PROMPT
    function result_prompt(values) {
        dispatch({
            type: 'show-prompt',
            payload: 'view-result',
            params: {
                task: values[0],
                data: values[1]
            }
        })
    }
    
    return (
        <Fragment>
            <Info
                header={ 'Task Manager' }
                data={{
                    'Contract': state.contracts.managers.task._address,
                    'Initialized': local.initialized ? 'True' : 'False',
                    'Token Fee': local.fee
                }}
            />
            <List
                header={ 'pending tasks' }
                fallback={ 'No tasks found.' }
                data={ local.pending }
                category={ '/tasks' }
            />
            <List
                header={ 'completed tasks' }
                fallback={ 'No tasks found.' }
                data={ local.completed }
                trigger={ result_prompt }
            />
            <Actions
                options={{
                    'create task': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'import-task'
                        })
                    },
                    'inspect task': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'inspect-task'
                        })
                    }
                }}
            />
        </Fragment>
    )
}