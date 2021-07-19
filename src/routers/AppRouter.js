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
import ModalProfile from '../components/ModalProfile'
import PostsAdmin from '../views/Admin/PostsAdmin'
import NewPost from '../views/Admin/NewPost'
import EditPost from '../views/Admin/EditPost'
import PostComments from '../views/Admin/PostComments'
import DirectorioAdmin from '../views/Admin/DirectorioAdmin'
import NewUser from '../views/Admin/NewUser'
import EditUser from '../views/Admin/EditUser'
import BibliotecaAdmin from '../views/Admin/BibliotecaAdmin'
import NewFile from '../views/Admin/NewFile'
import EditFile from '../views/Admin/EditFile'
import SliderAdmin from '../views/Admin/SliderAdmin'

const AppRouter = () => {
    return (
        <>
            <Switch>
                <Route path="/login" component={Login} />

                <PrivateRoute path="/admin" component={PostsAdmin} />
                <PrivateRoute path="/nuevopost" component={NewPost} />
                <PrivateRoute path="/editpost/:id" component={EditPost} />
                <PrivateRoute path="/directorioadmin" component={DirectorioAdmin} />
                <PrivateRoute path="/bibliotecaadmin" component={BibliotecaAdmin} />
                <PrivateRoute path="/slideradmin" component={SliderAdmin} />

                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/directorio" component={Directorio} />
                <PrivateRoute path="/biblioteca" component={Biblioteca} />
                <PrivateRoute path="/miperfil" component={Profile} />
                <PrivateRoute path="/sugerencias" component={Sugerencias} />
                <Redirect to="/home" />
            </Switch>
            <Switch>
                <PrivateRoute path="/home/post/:id">
                    <ModalPost />
                </PrivateRoute>
            </Switch>
            <Switch>
                <PrivateRoute path="/directorio/profile/:id">
                    <ModalProfile />
                </PrivateRoute>
            </Switch>

            <Switch>
                <PrivateRoute path="/editpost/:id/comments">
                    <PostComments />
                </PrivateRoute>
            </Switch>

            <Switch>
                <PrivateRoute path="/directorioadmin/nuevousuario">
                    <NewUser />
                </PrivateRoute>
            </Switch>
            <Switch>
                <PrivateRoute path="/directorioadmin/edituser/:id">
                    <EditUser />
                </PrivateRoute>
            </Switch>
            <Switch>
                <PrivateRoute path="/bibliotecaadmin/newfile">
                    <NewFile />
                </PrivateRoute>
            </Switch>
            <Switch>
                <PrivateRoute path="/bibliotecaadmin/editfile/:id">
                    <EditFile />
                </PrivateRoute>
            </Switch>
        </>
    )
}

export default AppRouter
