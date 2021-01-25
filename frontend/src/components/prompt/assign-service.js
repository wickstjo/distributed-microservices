import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Context } from '../../assets/context';
import { read } from '../../funcs/blockchain';

import Info from './info';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context);

    // LOCAL STATE
    const [local, set_local] = useState({
        devices: []
    })

    // ON LOAD
    useEffect(() => {
        const run = async() => {

            // FETCH THE USERS ORACLE COLLECTION
            const collection = await read({
                contract: 'oracle',
                func: 'fetch_collection',
                args: [state.keys.public]
            }, state)

            // SET IN STATE
            set_local({
                devices: collection
            })
        }

        // RUN THE ABOVE
        run()

    // eslint-disable-next-line
    }, [])
    
    return (
        <Fragment>
            <div id={ 'header' }>assign service to an oracle</div>
            <div id={ 'container' }>
                <Info
                    data={{
                        'Service': state.prompt.params.service,
                    }}
                />
            </div>
        </Fragment>
    )
}