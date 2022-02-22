import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import { useGetBirthdays } from '../../hooks/useGetBirthdays';
import { useStateValue } from '../../StateProvider'
import BirthdayBanner from './BirthdayBanner';
import './NavbarProfile.css'


const NavbarProfile = () => {
    const { cumples, hayCumples } = useGetBirthdays()
    const [{ }, dispatch] = useStateValue()
    const [closeCumples, setCloseCumples] = useState(false)

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

    const handleCloseCumples = () => setCloseCumples(true);

    return (
        <>
            {hayCumples &&
                <BirthdayBanner
                    dataString={cumples}
                    isClose={closeCumples}
                    handleClose={handleCloseCumples}
                />}
            <header className={`NavbarProfile ${hayCumples && !closeCumples && 'NavbarProfile_desplaz'}`}>

                <div className="header__logo">
                    <div className="nav__img">
                        <img src="./assets/logo-header.png" alt="" />
                    </div>
                </div>

                <i onClick={showMenu} className='bx bx-menu header__toggle' id="header-toggle"></i>

                <nav className="NavbarProfile__nav" id="nav-menu">
                    <div className="nav__content bd-grid">
                        <a href="/home" className="nav__perfil">
                            <div className="nav__img">
                                <img src="./assets/logo-header.png" alt="" />
                            </div>
                        </a>

                        <div className="nav__menu">
                            <ul className="nav__list">
                                <li className="nav__item">
                                    <NavLink to="/home" activeClassName="active" className="nav__link">Inicio</NavLink>
                                </li>

                                <li className="nav__item">
                                    <NavLink to="/directorio" activeClassName="active" className="nav__link">Directorio</NavLink>
                                </li>

                                <li className="nav__item">
                                    <NavLink to="/comedor" activeClassName="active" className="nav__link">Comedor</NavLink>
                                </li>

                                <li className="nav__item">
                                    <NavLink to="/sugerencias" activeClassName="active" className="nav__link">Sugerencias</NavLink>
                                </li>

                                <li className="nav__item">
                                    <NavLink to="/biblioteca" activeClassName="active" className="nav__link">Biblioteca</NavLink>
                                </li>

                                <li className="nav__item dropdown">
                                    <span id="dropdownNav" data-bs-toggle="dropdown" className="nav__link dropdown-toggle">Mi Perfil</span>

                                    <ul aria-labelledby="dropdownNav" className="dropdown-menu">
                                        <li className="dropdown-item">
                                            <NavLink to="/miperfil" className="nav__link">Mis Datos</NavLink>
                                        </li>
                                        <li className="dropdown-item">
                                            <NavLink onClick={handleLogout} to="/login" className="nav__link">Cerrar Sesión</NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default NavbarProfile
