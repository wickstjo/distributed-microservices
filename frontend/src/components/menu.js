import React, { useContext } from 'react';
import '../interface/css/menu.scss';
import { Context } from "../assets/context";
import MenuItem from './menu/item';

export default() => {

    // GLOBAL STATE
    const { state } = useContext(Context);
    
    return (
        <div id="menu">
            <div className={ 'split' }>
                <div>
                    <MenuItem
                        header={ 'Tasks' }
                        link={ '/' }
                    />
                    <MenuItem
                        header={ 'Oracles' }
                        link={ '/oracles' }
                    />
                    <MenuItem
                        header={ 'Users' }
                        link={ '/users' }
                    />
                    <MenuItem
                        header={ 'Tokens' }
                        link={ '/tokens' }
                    />
                </div>
                <div>
                    {
                        state.verified ? <MenuItem
                            header={ 'Profile' }
                            link={ '/users/' + state.keys.public }
                        /> : null
                    }
                    <MenuItem
                        header={ 'Whisper' }
                        link={ '/whisper' }
                    />
                </div>
            </div>
        </div>
    )
}