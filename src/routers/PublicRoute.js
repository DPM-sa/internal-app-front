import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../StateProvider';

const PublicRoute = ({ component: Component, ...props }) => {

    const [{ token }] = useStateValue()

    return (
        <Route {...props} render={props => token ? (
            <Redirect to="/home" />
        ) : (
            <Component {...props} />
        )} />

    );
}

export default PublicRoute;