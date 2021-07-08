import React from 'react'
import './NavbarProfile.css'
import { NavLink } from "react-router-dom";
import { useStateValue } from '../StateProvider'
const NavbarProfile = () => {
    const [{ }, dispatch] = useStateValue()
    const showMenu = () => {
        const toggle = document.getElementById('header-toggle')
        const nav = document.getElementById('nav-menu')
        nav.classList.toggle('show')
        toggle.classList.toggle('bx-x')
    }
    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT'
        })
    }
    return (
        <header className="NavbarProfile__header">
            <div className="header__logo">
                <div className="nav__img">
                    <img src="./assets/logo-header.png" alt="" />
                </div>
            </div>

            <i onClick={showMenu} className='bx bx-menu header__toggle' id="header-toggle"></i>

            <nav className="NavbarProfile__nav" id="nav-menu">
                <div className="nav__content bd-grid">
                    <a href="" className="nav__perfil">
                        <div className="nav__img">
                            <img src="./assets/logo-header.png" alt="" />
                        </div>
                    </a>

                    <div className="nav__menu">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <NavLink exact to="/home" activeClassName="active" className="nav__link">Inicio</NavLink>
                            </li>

                            <li className="nav__item">
                                <NavLink exact to="/directorio" activeClassName="active" className="nav__link">Directorio</NavLink>
                            </li>

                            <li className="nav__item">
                                <NavLink exact to="/sugerencias" activeClassName="active" className="nav__link">Sugerencias</NavLink>
                            </li>

                            <li className="nav__item">
                                <NavLink exact to="/biblioteca" activeClassName="active" className="nav__link">Biblioteca</NavLink>
                            </li>

                            <li className="nav__item dropdown">
                                <span className="nav__link">Mi Perfil <i class='bx bx-chevron-down dropdown__icon'></i></span>

                                <ul class="dropdown__menu">
                                    <li class="dropdown__item">
                                        <NavLink exact to="/miperfil" class="nav__link">Mis Datos</NavLink>
                                    </li>
                                    <li class="dropdown__item">
                                        <NavLink onClick={handleLogout} exact to="/login" class="nav__link">Cerrar Sesión</NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

    )
}

export default NavbarProfile
