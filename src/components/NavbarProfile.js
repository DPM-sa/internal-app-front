import React from 'react'
import './NavbarProfile.css'
import { NavLink } from "react-router-dom";

const NavbarProfile = () => {

    const showMenu = () => {
        const toggle = document.getElementById('header-toggle')
        const nav = document.getElementById('nav-menu')
        nav.classList.toggle('show')
        toggle.classList.toggle('bx-x')
    }

    return (
        <header className="NavbarProfile__header">
            <div className="header__logo">
                <div className="nav__img">
                    <img src="https://laguia.online/business/veGwa/asset/fb.jpg" alt="" />
                </div>
            </div>

            <i onClick={showMenu} className='bx bx-menu header__toggle' id="header-toggle"></i>

            <nav className="NavbarProfile__nav" id="nav-menu">
                <div className="nav__content bd-grid">
                    <a href="" className="nav__perfil">
                        <div className="nav__img">
                            <img src="https://laguia.online/business/veGwa/asset/fb.jpg" alt="" />
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

                            <li className="nav__item">
                                <NavLink exact to="/miperfil" activeClassName="active" className="nav__link">Mi Perfil</NavLink>
                            </li>

                            <li className="nav__item">
                                <NavLink exact to="/login" activeClassName="active" className="nav__link">Cerrar Sesion</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

    )
}

export default NavbarProfile
