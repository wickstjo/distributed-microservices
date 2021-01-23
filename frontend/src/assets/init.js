import { useContext, useEffect } from 'react';
import { Context } from './context';

import { sleep } from '../funcs/misc';
import { init, read } from '../funcs/blockchain';
import { create_feed } from '../funcs/whisper';
import { shorten, to_date } from '../funcs/chat';
import { decode, exists } from '../funcs/process';

export default () => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context);

    // LOAD ONCE
    useEffect(() => {

        // INITIALIZE ETHEREUM APIs & DATA
        init(state).then(data => {

            // SAVE CONNECTION DATA IN STATE
            dispatch({
                type: 'init',
                payload: data
            })
        })

        // HIDE METAMASK GARBAGE
        if (window.ethereum !== undefined) {
            window.ethereum.autoRefreshOnNetworkChange = false;
        }

        // WINDOW SIZE LISTENER
        window.addEventListener('resize', () => {
            dispatch({
                type: 'window',
                payload: {
                    height: window.innerHeight,
                    width: window.innerWidth
                }
            })
        })

        // MOUSE CLICK EVENT LISTENER
        window.addEventListener('click', event => {
            dispatch({
                type: 'click-event',
                payload: event
            })
        })

        // KEY EVENT LISTENER
        window.addEventListener('keydown', event => {
            dispatch({
                type: 'key-event',
                payload: event
            })
        })

    // eslint-disable-next-line
    }, [])

    // AUTOLOGIN USER -- IF THEY ARE REGISTERED
    useEffect(() => {
        if (state.web3 !== null) {
            const run = async() => {

                // CHECK IF THE USER IS REGISTERED
                const result = await read({
                    contract: 'user',
                    func: 'fetch',
                    args: [state.keys.public]
                }, state)

                // SLEEP FOR A SECONDS
                await sleep(1)

                // CHECK THE RESULT VALIDITY
                const check = exists(result);

                // IF EVERYTHING CHECKS OUT
                if (check) {

                    // SET LOGIN IN STATE
                    dispatch({
                        type: 'verify',
                        payload: result
                    })

                    // ALERT WITH MESSAGE
                    dispatch({
                        type: 'toast-message',
                        payload: {
                            type: 'good',
                            msg: 'you have been autologged in'
                        }
                    })
                }
            }

            // RUN THE ABOVE
            run()
        }

    // eslint-disable-next-line
    }, [state.web3])

    // CREATE WHISPER MESSAGE FEED
    useEffect(() => {
        if (state.shh !== null) {

            // ON MESSAGE..
            create_feed(response => {
        
                // RENDER IT TO THE WHISPER PAGE
                dispatch({
                    type: 'whisper-message',
                    payload: {
                        user: shorten(response.sig, 4),
                        msg: state.utils.to_string(response.payload),
                        timestamp: to_date(response.timestamp)
                    }
                })
            }, state, dispatch)
        }

    // eslint-disable-next-line
    }, [state.whisper.topic])

    // COLLECT DEVICE QUERY RESPONSES
    useEffect(() => {
        if (state.query.active) {
            
            // SELECT THE LAST SUBMITTED MESSAGE
            const last = state.whisper.messages[state.whisper.messages.length - 1].msg

            // ATTEMPT TO DECODE THE MESSAGE
            const decoded = decode(last)

            // IF IT IS A RESPONSE & THE ID MATCHES THE QUERY
            if (decoded.type === 'response' && decoded.source === state.query.id) {

                // ADD QUERY RESPONSE
                dispatch({
                    type: 'query-response',
                    payload: decoded.oracle
                })

                // ALERT WITH MESSAGE
                dispatch({
                    type: 'toast-message',
                    payload: {
                        type: 'good',
                        msg: 'a device has responded'
                    }
                })
            }
        }

    // eslint-disable-next-line
    }, [state.whisper.messages])

    return null;
}