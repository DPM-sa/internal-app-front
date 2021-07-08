import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from '../views/Login'
import PrivateRoute from './PrivateRoute'
import Home from '../views/Home'
import Directorio from '../views/Directorio'
import Biblioteca from '../views/Biblioteca'
import Profile from '../views/Profile'
import Sugerencias from '../views/Sugerencias'
import ModalPost from '../components/ModalPost'
import ModalSlider from '../components/ModalSlider'

const AppRouter = () => {
    return (
        <>
            <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute exact path="/directorio" component={Directorio} />
                <PrivateRoute exact path="/biblioteca" component={Biblioteca} />
                <PrivateRoute exact path="/miperfil" component={Profile} />
                <PrivateRoute exact path="/sugerencias" component={Sugerencias} />
                <Redirect to="/home" />
            </Switch>
            <Switch>
                <Route path="/home/post/:id">
                    <ModalPost />
                </Route>
            </Switch>
            <Switch>
                <Route path="/home/slider/:id">
                    <ModalSlider />
                </Route>
            </Switch>
        </>
    )
}

export default AppRouter
