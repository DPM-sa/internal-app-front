import React from 'react'
import './SidebarAdmin.css'

const SidebarAdmin = () => {

    const handleShowSidebar = () => {
        const sidebar = document.querySelector('.sidebar')
        const icon = document.querySelector('.icon')
        sidebar.classList.toggle('sidebar-show')
        icon.classList.toggle('fa-bars')
        icon.classList.toggle('fa-times')
    }

    return (
        <div className="sidebar">
            <div class="sidebar__content">
                <div className="sidebar__content-img">
                    <img src={window.location.origin + "/assets/logo-footer.png"} className="sidebar__logo" />
                </div>
                <p className="sidebar__text">Panel administrador del espacio de comunicación interna.</p>
                <ul className="sidebar__options">
                    <li className="sidebar__options-item">
                        <i class="far fa-file-alt"></i>
                        Publicaciones
                    </li>
                    <li className="sidebar__options-item">
                        <i class="far fa-envelope"></i>
                        Buzon de sugerencias
                    </li>
                    <li className="sidebar__options-item">
                        <i class="far fa-address-book"></i>
                        Directorio de usuarios
                    </li>
                    <li className="sidebar__options-item">
                        <i class="far fa-image"></i>
                        Slider principal
                    </li>
                    <li className="sidebar__options-item">
                        <i class="far fa-copy"></i>
                        Biblioteca
                    </li>
                    <li className="sidebar__options-item">
                        <i class="fas fa-mouse-pointer"></i>
                        Ir al sitio
                    </li>
                    <li className="sidebar__options-item">
                        <i class="far fa-times-circle"></i>
                        Cerrar sesión
                    </li>
                </ul>
                <div className="sidebar__user">
                    Usuario activo:
                    <p className="sidebar__user-active">recursos-humanos</p>
                </div>
            </div>
            <button onClick={handleShowSidebar} className="button-sidebar">
                <i class="fas fa-bars icon"></i>
            </button>
        </div>
    )
}

export default SidebarAdmin
