import React, { useContext, Fragment } from 'react';
import { Context } from '../../assets/context';
import { load_yaml, sleep } from '../../funcs/misc';
import { write } from '../../funcs/blockchain';
import { encode } from '../../funcs/process';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // PARSE A YAML FILE
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

                // DECONSTRUCT YAML PARAMS
                const { name, fee, repository, parameters } = yaml.data;

                // ENCODE THE PARAMS TO BASE64
                const encoded = encode(parameters)
                
                // CREATE THE ORACLE
                const result = await write({
                    contract: 'service',
                    func: 'create',
                    args: [name, fee, repository, encoded]
                }, state)

                // EVERYTHING WENT FINE
                if (result.success) {

                    // CREATE TOAST MESSAGE
                    dispatch({
                        type: 'toast-message',
                        payload: {
                            type: 'good',
                            msg: 'service created'
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
            <div id={ 'header' }>create a new service</div>
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