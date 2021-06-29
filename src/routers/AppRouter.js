import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Login from '../views/Login'
import DashboardRoutes from './DashboardRoutes'
const AppRouter = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" component={DashboardRoutes} />
                </Switch>
            </div>
        </Router>
    )
}

export default AppRouter
