import React from 'react'
import { Switch, Redirect } from 'react-router-dom'

import PublicRoute from './PublicRoute'
import AdminRoute from './AdminRoute'
import PrivateRoute from './PrivateRoute'

import Login from '../views/User/Login'
import Home from '../views/User/Home'
import Directorio from '../views/User/Directorio'
import Biblioteca from '../views/User/Biblioteca'
import Profile from '../views/User/Profile'
import Sugerencias from '../views/User/Sugerencias'
import ModalPost from '../components/User/ModalPost'
import ModalProfile from '../components/User/ModalProfile'

// import PostsAdmin from '../views/Admin/PostsAdmin'
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
import IndexAdmin from '../views/Admin/IndexAdmin'
import ComedoresAdmin from '../views/Admin/ComedoresAdmin'
import NewComedor from '../views/Admin/NewComedor'
import EditComedor from '../views/Admin/EditComedor'
import NewVianda from '../views/Admin/NewVianda'
import ReservasDiarias from '../views/Admin/ReservasDiarias'
import InformesMensuales from '../views/Admin/InformesMensuales'
import ComedorUser from '../views/User/ComedorUser'
import EditVianda from '../views/Admin/EditVianda'
import SalaReunionesAdmin from '../views/Admin/SalaReunionesAdmin'
import NewSala from '../views/Admin/NewSala'
import EditSala from '../views/Admin/EditSala'
import ReunionesUser from '../views/User/ReunionesUser'

const AppRouter = () => {
    return (
        <>
            <Switch>
                <PublicRoute path="/login" component={Login} />

                <AdminRoute path="/admin" component={IndexAdmin} />
                <AdminRoute path="/nuevopost" component={NewPost} />
                <AdminRoute path="/editpost/:id" component={EditPost} />
                <AdminRoute path="/directorioadmin" component={DirectorioAdmin} />
                <AdminRoute path="/comedoresAdmin" component={ComedoresAdmin} />
                <AdminRoute path="/reunionesAdmin" component={SalaReunionesAdmin} />
                <AdminRoute path="/bibliotecaadmin" component={BibliotecaAdmin} />
                <AdminRoute path="/slideradmin" component={SliderAdmin} />
                <AdminRoute path="/sugerenciasadmin" component={SugerenciasAdmin} />

                <PrivateRoute path="/comedor" component={ComedorUser} />
                <PrivateRoute path="/reuniones" component={ReunionesUser} />

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

                <PrivateRoute path="/directorio/profile/:id">
                    <ModalProfile />
                </PrivateRoute>
                <PrivateRoute path="/editpost/:id/comments">
                    <PostComments />
                </PrivateRoute>

           
                <AdminRoute path="/directorioadmin/nuevousuario">
                    <NewUser />
                </AdminRoute>
                <AdminRoute path="/directorioadmin/edituser/:id">
                    <EditUser />
                </AdminRoute>


                <AdminRoute path="/bibliotecaadmin/newfile/:sector">
                    <NewFile />
                </AdminRoute>
                <AdminRoute path="/bibliotecaadmin/editfile/:id">
                    <EditFile />
                </AdminRoute>
        

                <AdminRoute path="/comedoresadmin/nuevo">
                    <NewComedor />
                </AdminRoute>
                <AdminRoute path="/comedoresadmin/edit/:id">
                    <EditComedor />
                </AdminRoute>
                <AdminRoute path="/comedoresadmin/newvianda/:id">
                    <NewVianda />
                </AdminRoute>
                <AdminRoute path="/comedoresadmin/viandasedit/:id">
                    <EditVianda />
                </AdminRoute>
                <AdminRoute path="/comedoresadmin/reservasdiarias/:id">
                    <ReservasDiarias />
                </AdminRoute>
                <AdminRoute path="/comedoresadmin/informesmensuales/:id">
                    <InformesMensuales />
                </AdminRoute>


                <AdminRoute path="/reunionesadmin/nuevo">
                    <NewSala />
                </AdminRoute>
                <AdminRoute path="/reunionesadmin/edit/:id">
                    <EditSala />
                </AdminRoute>
            </Switch>
        </>
    )
}

export default AppRouter
