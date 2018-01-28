import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';

import history from './history';

import Main from '../components/Main';
import Header from '../components/Header';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Saved from '../components/Saved';
import NotFound from '../components/NotFound';
import Home from '../components/Home';
import Recent from '../components/Recent';


export const routes = (
    <Router history={history}>
        <Main>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={Home} />
                <Route path="/recent" component={Recent} />
                <Route path="/favorites" component={Saved} />
                <Route path="*" component={NotFound} />
            </Switch>
        </Main>
    </Router>
)