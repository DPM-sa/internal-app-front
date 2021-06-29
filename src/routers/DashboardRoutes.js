import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import Admin from '../views/Admin';

const DashboardRoutes = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/admin" component={Admin} />
                <Redirect to="/admin" />
            </Switch>
        </div>
    )
}

export default DashboardRoutes
