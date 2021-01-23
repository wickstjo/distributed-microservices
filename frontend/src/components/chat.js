import React from 'react';
import '../interface/css/whisper.scss';

export default ({ data }) => {
    switch (data.length) {

        // RENDER NOTHING
        case 0: {
            return <div id={ 'fallback' }>No messages found.</div>;
        }

        // RENDER MESSAGES
        default: { return (
            <div id={ 'whisper' }>
                { data.map((data, index) =>
                    <div id={ 'message' } key={ index }>
                        <div id={ 'timestamp' }>{ data.timestamp }</div>
                        <div id={ 'user' }>{ data.user }</div>
                        <div id={ 'msg' }>{ data.msg.length > 40 ? data.msg.substring(0, 37) + '...' : data.msg }</div>
                    </div>
                )}
            </div>
        )}
    }
}