import React, { useContext, Fragment } from 'react';
import { Context } from '../../assets/context';
import { load_yaml, sleep } from '../../funcs/misc';
import { write } from '../../funcs/blockchain';
import { encode } from '../../funcs/process';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // PARSE YAML FILE
    async function parse(event) {
        event.persist();

        // IF THE INPUT ISNT EMPTY
        if (event.target.value !== null) {

            // ATTEMPT TO LOAD THE UPLOADED YAML FILE
            const yaml = await load_yaml(event)

            // SHOW LOADING SCREEN
            dispatch({
                type: 'show-prompt',
                payload: 'loading'
            })

            // SLEEP FOR TWO SECOND TO SMOOTHEN TRANSITION
            await sleep(2)
            
            // EVEYRTHING WENT FINE
            if (yaml.success) {

                // DECONSTRUCT TASK PARAMS
                const { oracle, reward, timelimit, params } = yaml.data

                // ENCODE THE TASK PARAMS TO BASE64
                const morphed = encode(params)
                
                // CREATE THE ORACLE
                const result = await write({
                    contract: 'task',
                    func: 'create',
                    args: [
                        oracle,
                        reward,
                        timelimit,
                        morphed,
                    ]
                }, state)

                // EVERYTHING WENT FINE
                if (result.success) {

                    // CREATE TOAST MESSAGE
                    dispatch({
                        type: 'toast-message',
                        payload: {
                            type: 'good',
                            msg: 'task created'
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

            // OTHERWISE, SHOW ERROR
            } else {
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'bad',
                        msg: 'the yaml file could not be parsed'
                    }
                })
            }
        }

        // HIDE PROMPT
        dispatch({ type: 'hide-prompt' })
    }
    
    return (
        <Fragment>
            <div id={ 'header' }>create a new task</div>
            <div id={ 'container' }>
                <input
                    id={ 'import' }
                    type={ 'file' }
                    onChange={ parse }
                />
                <div id={ 'import-label' }>Select or drop a YAML config</div>
            </div>
        </Fragment>
    )
}