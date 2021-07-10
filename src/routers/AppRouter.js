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
import { useStateValue } from '../StateProvider'
import axios from 'axios'
import ModalProfile from '../components/ModalProfile'
const AppRouter = () => {
    const [{ user }, dispatch] = useStateValue()

    let headers = {
        'Content-Type': 'application/json'
    }
    const getToken = async () => {
        await axios.post('https://internal-app-dpm.herokuapp.com/renew',
            {
                "user": `${user.user}`
            },
            { headers }
        ).then(resp => {
            console.log(resp)
            dispatch({
                type: 'LOGIN',
                token: resp.data.token,
                user: resp.data.usuario
            })
        })
    }

    useEffect(() => {
        if (user) {
            getToken()
        }
    }, [])
    return (
        <>
            <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/directorio" component={Directorio} />
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
            <Switch>
                <Route path="/directorio/profile/:id">
                    <ModalProfile />
                </Route>
            </Switch>
        </>
    )
}

export default AppRouter
