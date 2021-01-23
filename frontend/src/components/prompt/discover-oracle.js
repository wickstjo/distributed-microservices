import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import '../../interface/css/input.scss';
import { Context } from '../../assets/context';
import reducer from '../../states/input';
import { encode } from '../../funcs/process';
import { Link } from 'react-router-dom';

import Text from '../input/text';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // INPUT STATE
    const [input, set_input] = useReducer(reducer, {
        query_key: {
            value: '',
            status: false
        },
        query_value: {
            value: '',
            status: false
        }
    })

    // WHEN A VALID ADDRESS IS INPUT & ENTER IS PRESSED
    useEffect(() => {
        if (state.prompt.visible && input.query_key.status && input.query_value.status && state.key_event.key === 'Enter') {

            // CONSTRUCT & ENCODE THE WHISPER QUERY
            const encoded = encode({
                type: 'request',
                discovery: {
                    [input.query_key.value]: input.query_value.value
                }
            })

            // SEND THE MESSAGE
            state.shh.post({
                symKeyID: state.whisper.symkey,
                sig: state.whisper.id,
                ttl: 10,
                topic: state.utils.to_hex(state.whisper.topic),
                payload: state.utils.to_hex(encoded),
                powTime: 3,
                powTarget: 0.5
            
            // EVERYTHING OK...
            }).then(() => {

                // ACTIVATE QUERY
                dispatch({
                    type: 'set-query',
                    payload: encoded
                })

                // SHOW POSITIVE ALERT
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'good',
                        msg: 'A query has been sent submitted'
                    }
                })

            // OTHERWISE, SHOW ERROR
            }).catch(() => {
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'bad',
                        msg: 'Could not submit query'
                    }
                })
            })
        }

    // eslint-disable-next-line
    }, [state.key_event])

    // RESET QUERY IF INPUT CHANGES
    useEffect(() => {
        if (state.query.active) {
            dispatch({
                type: 'reset-query'
            })
        }

    // eslint-disable-next-line
    }, [input])

    return (
        <Fragment>
            <div id={ 'header' }>discover an available oracle</div>
            <div id={ 'container' }>
                <div id={ 'search' }>
                    <div>
                        <Text
                            data={ input.query_key }
                            placeholder={ 'Enter parameter key' }
                            range={[ 1, 20 ]}
                            update={ set_input }
                            id={ 'query_key' }
                        />
                    </div>
                    <div>
                        <Text
                            data={ input.query_value }
                            placeholder={ 'Enter parameter value' }
                            range={[ 1, 100 ]}
                            update={ set_input }
                            id={ 'query_value' }
                        />
                    </div>
                </div>
                <Results
                    active={ state.query.active }
                    data={ state.query.results }
                    close={() => {
                        dispatch({ type: 'hide-prompt' })
                    }}
                />
            </div>
        </Fragment>
    )
}

function Results({ active, data, close }) { return (
    <div id={ 'results' } className={ active ? 'active' : 'inactive' }>
        <div id={ 'header' }>awaiting responses...</div>
        { data.map((item, index) =>
            <Link to={ '/oracles/' + item } key={ index } onClick={ close }>
                <div id={ 'result' }>{ item }</div>
            </Link>
        )}
    </div>
)}