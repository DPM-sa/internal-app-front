import React from 'react'
import { Link } from 'react-router-dom'
import { useStateValue } from '../../StateProvider'
import './SidebarAdmin.css'

const SidebarAdmin = () => {
    const [{ user }, dispatch] = useStateValue()

    const admin = ( user.role === "ADMIN_ROLE" );

    const handleShowSidebar = () => {
        const sidebar = document.querySelector('.sidebar')
        const icon = document.querySelector('.icon')
        sidebar.classList.toggle('sidebar-show')
        icon.classList.toggle('fa-bars')
        icon.classList.toggle('fa-times')
    }

    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT'
        })
    }
    
    return (
        <div className="sidebar">
            <div className="sidebar__content">
                <div className="sidebar__content-img">
                    <img alt="logo" src={window.location.origin + "/assets/logo-footer.png"} className="sidebar__logo" />
                </div>
                <p className="sidebar__text">Panel administrador del espacio de comunicación interna.</p>
                <ul className="sidebar__options">
                    
                    { admin &&
                    <>
                    <li className="sidebar__options-item">
                        <Link to="/admin">
                            <i className="far fa-file-alt"></i>
                            Publicaciones
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link to="/sugerenciasadmin">
                            <i className="far fa-envelope"></i>
                            Buzon de sugerencias
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link to="/directorioadmin">
                            <i className="far fa-address-book"></i>
                            Directorio de usuarios
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link to="/slideradmin">
                            <i className="far fa-image"></i>
                            Slider principal
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link to="/comedoresadmin">
                            <i className="fa fa-cutlery"></i>
                            Comedores
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link to="/reunionesadmin">
                            <i className="fa fa-group"></i>
                            Reuniones
                        </Link>
                    </li>
                    </>
                    }
                    <li className="sidebar__options-item">
                        <Link to="/bibliotecaadmin">
                            <i className="far fa-copy"></i>
                            Biblioteca
                        </Link>
                    </li>
           
                    <li className="sidebar__options-item">
                        <Link to="/home">
                            <i className="fas fa-mouse-pointer"></i>
                            Ir al sitio
                        </Link>
                    </li>
                    <li className="sidebar__options-item">
                        <Link onClick={handleLogout} to="/home">
                            <i className="far fa-times-circle"></i>
                            Cerrar sesión
                        </Link>
                    </li>
                </ul>
                <div className="sidebar__user">
                    Usuario activo:
                    <p className="sidebar__user-active">{user.user}</p>
                </div>
            </div>
            <button onClick={handleShowSidebar} className="button-sidebar">
                <i className="fas fa-bars icon"></i>
            </button>
        </div>
    )
}

export default SidebarAdmin
