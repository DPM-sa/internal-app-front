import React, { useEffect } from 'react'
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
import ModalProfile from '../components/ModalProfile'
import PostsAdmin from '../views/PostsAdmin'
import NewPost from '../views/NewPost'

const AppRouter = () => {
    return (
        <>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/admin" component={PostsAdmin} />
                <Route path="/nuevopost" component={NewPost} />
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/directorio" component={Directorio} />
                <PrivateRoute path="/biblioteca" component={Biblioteca} />
                <PrivateRoute path="/miperfil" component={Profile} />
                <PrivateRoute path="/sugerencias" component={Sugerencias} />
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
            <Switch>
                <Route path="/directorio/profile/:id">
                    <ModalProfile />
                </Route>
            </Switch>
        </>
    )
}

export default AppRouter
