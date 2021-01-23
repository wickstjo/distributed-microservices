import React, { useContext } from 'react';
import { Context } from './context';
import { Route, Switch, Redirect } from 'react-router-dom';
import '../interface/css/innerbody.scss';

import Tasks from '../pages/tasks';
import Task from '../pages/task';

import Oracles from '../pages/oracles';
import Oracle from '../pages/oracle';

import Users from '../pages/users';
import User from '../pages/user';

import Tokens from '../pages/tokens';
import Whisper from '../pages/whisper';
import Error from '../pages/error';

export default () => {

    // GLOBAL STATE
    const { state } = useContext(Context);

    // IF WHISPER & WEB3 CONNECTIONS HAVE BEEN ESTABLISHED
    if (state.initialized) { return (

        <div id={ 'innerbody' }>
            <Switch>
                <Route exact path="/" component={() => <Redirect to={ '/tasks' } /> } />

                <Route exact path={ '/tasks' } component={ Tasks } />
                <Route path={ '/tasks/:address' } component={ Task } />

                <Route exact path={ '/oracles' } component={ Oracles } />
                <Route path={ '/oracles/:hash' } component={ Oracle } />

                <Route exact path={ '/users' } component={ Users } />
                <Route path={ '/users/:address' } component={ User } />

                <Route exact path={ '/tokens' } component={ Tokens } />
                <Route exact path={ '/whisper' } component={ Whisper } />
                <Route component={ Error } />
            </Switch>
        </div>

    // OTHERWISE, RENDER NOTHING
    )} else { return null }
}