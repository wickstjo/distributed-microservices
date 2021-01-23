import React, { Fragment, useContext } from 'react';
import { Context } from '../../assets/context';

import Info from './info';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context);
    
    return (
        <Fragment>
            <div id={ 'header' }>task result</div>
            <div id={ 'container' }>
                <Info
                    data={{
                        'Task Contract': state.prompt.params.task,
                        'Result Data': state.prompt.params.data
                    }}
                />
            </div>
        </Fragment>
    )
}