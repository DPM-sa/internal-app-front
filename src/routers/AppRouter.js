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
import SugerenciasAdmin from '../views/Admin/SugerenciasAdmin'
import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'

const AppRouter = () => {
    return (
        <>
            <Switch>
                <PublicRoute path="/login" component={Login} />

                <AdminRoute path="/admin" component={PostsAdmin} />
                <AdminRoute path="/nuevopost" component={NewPost} />
                <AdminRoute path="/editpost/:id" component={EditPost} />
                <AdminRoute path="/directorioadmin" component={DirectorioAdmin} />
                <AdminRoute path="/bibliotecaadmin" component={BibliotecaAdmin} />
                <AdminRoute path="/slideradmin" component={SliderAdmin} />
                <AdminRoute path="/sugerenciasadmin" component={SugerenciasAdmin} />

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
                <AdminRoute path="/directorioadmin/nuevousuario">
                    <NewUser />
                </AdminRoute>
            </Switch>
            <Switch>
                <AdminRoute path="/directorioadmin/edituser/:id">
                    <EditUser />
                </AdminRoute>
            </Switch>
            <Switch>
                <AdminRoute path="/bibliotecaadmin/newfile">
                    <NewFile />
                </AdminRoute>
            </Switch>
            <Switch>
                <AdminRoute path="/bibliotecaadmin/editfile/:id">
                    <EditFile />
                </AdminRoute>
            </Switch>
        </>
    )
}

export default AppRouter
