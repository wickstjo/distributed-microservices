import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import { read } from '../funcs/blockchain';
import reducer from '../states/local';
import { Link } from 'react-router-dom';
import { decode } from '../funcs/process';

import Info from '../components/shared/info';
import Actions from '../components/actions';

export default ({ match }) => {

    // GLOBAL STATE
    const { state, dispatch } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        author: '',
        name: '',
        fee: '',
        repository: '',
        params: {},
        updated: 0
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // ORACLE OWNER
                    author: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'author'
                    }, state),

                    // ACTIVE STATUS
                    name: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'name'
                    }, state),

                    // DISCOVERABLE STATUS
                    fee: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'fee'
                    }, state),

                    // TASK COMPLETED
                    repository: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'repository'
                    }, state),

                    // TASK COMPLETED
                    params: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'params'
                    }, state),

                    // TASK COMPLETED
                    updated: await read({
                        contract: 'service',
                        address: match.params.address,
                        func: 'updated'
                    }, state),
                }
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])

    return (
        <Fragment>
            <Info
                header={ 'service contract' }
                data={{
                    'Contract': match.params.address,
                    'Author': <Link to={ '/users/' + local.author }>{ local.author }</Link>,
                    'Service Name': local.name,
                    'Token Fee': local.fee,
                    'Repository': <a href={ local.repository } target={ '_blank' } rel={ 'noopener noreferrer' }>{ local.repository }</a>,
                    'Last Updated': local.updated
                }}
            />
            <Info
                header={ 'service parameters' }
                data={ decode(local.params) }
            />
            <Actions
                options={{
                    'assign to device': () => {
                        dispatch({
                            type: 'show-prompt',
                            payload: 'assign-service',
                            params: {
                                service: match.params.address
                            }
                        })
                    },
                    'query available devices': () => {}
                }}
            />
        </Fragment>
    )
}