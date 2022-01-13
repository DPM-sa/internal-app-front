import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../StateProvider';

const AdminRoute = ({ component: Component, ...props }) => {

    const [{ user }] = useStateValue()

    return (
        <Route {...props} render={props => user.role === "USER_ROLE" ? (
            <Redirect to="/home" />
        ) : (
            <Component {...props} />
        )} />

    );
}

export default AdminRoute;