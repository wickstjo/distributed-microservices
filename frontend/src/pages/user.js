import React, { useContext, useReducer, Fragment, useEffect } from 'react';
import { Context } from '../assets/context';
import { read } from '../funcs/blockchain';
import reducer from '../states/local';

import Info from '../components/shared/info';

export default ({ match }) => {

    // GLOBAL STATE
    const { state } = useContext(Context)

    // LOCAL STATE
    const [local, set_local] = useReducer(reducer, {
        contract: '',
        reputation: ''
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            const user_address = await read({
                contract: 'user',
                func: 'fetch',
                args: [match.params.address]
            }, state)

            // FETCH DATA & SET IN STATE
            set_local({
                type: 'all',
                payload: {

                    // USER CONTRACT ADDRESS
                    contract: user_address,

                    // USER REPUTATION
                    reputation: await read({
                        contract: 'user',
                        address: user_address,
                        func: 'reputation'
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
                header={ 'user contract' }
                data={{
                    'Contract': local.contract,
                    'Ethereum Wallet': match.params.address,
                    'Reputation': local.reputation
                }}
            />
        </Fragment>
    )
}