import React, { useContext, Fragment } from 'react';
import { Context } from '../assets/context';
import Chat from '../components/chat';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context)
    
    return (
        <Fragment>
            <div id={ 'header' }>whisper feed</div>
            <div id={ 'container' }>
                <Chat data={ state.whisper.messages } />
            </div>
        </Fragment>
    )
}