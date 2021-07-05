import React from 'react'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import PrivateRoute from './PrivateRoute'
import Home from '../views/Home'
import Directorio from '../views/Directorio'
import Biblioteca from '../views/Biblioteca'
import Profile from '../views/Profile'
import Sugerencias from '../views/Sugerencias'
const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/home" component={Home} />
                <PrivateRoute exact path="/directorio" component={Directorio} />
                <PrivateRoute exact path="/biblioteca" component={Biblioteca} />
                <PrivateRoute exact path="/miperfil" component={Profile} />
                <PrivateRoute exact path="/sugerencias" component={Sugerencias} />
                <Redirect to ="/home" />
            </Switch>
        </Router>
    )
}

export default AppRouter
