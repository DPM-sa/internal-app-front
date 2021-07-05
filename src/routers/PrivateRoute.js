import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../StateProvider';

const PrivateRoute = ({ component: Component, ...props  }) => {

    const [{token}] = useStateValue()

    return ( 
        <Route { ...props } render={ props => !token ?  (
            <Redirect to="/login" />
        )  : (
            <Component {...props} />
        ) } />

     );
}
 
export default PrivateRoute;