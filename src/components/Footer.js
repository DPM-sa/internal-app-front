import React from 'react'
import { NavLink } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import './Footer.css'

const Footer = () => {
    const [{ }, dispatch] = useStateValue()
    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT'
        })
    }
    return (
        <footer className="Footer">

            <div className="Footer__content">

                <div className="Footer__content-top">

                    <div className="Footer__content-top-section">
                        <div className="Footer__content-top-section-cropped-img">
                            <img src="./assets/logo-footer.png" className="Footer__logo" />
                        </div>
                        <h6>Comunicación Interna</h6>
                        <p>AREA RECURSOS HUMANOS</p>
                    </div>

                    <div className="Footer__content-top-section">
                        <ul>
                            <li><NavLink exact to="/home">Inicio</NavLink></li>
                            <li><NavLink exact to="/directorio">Directorio</NavLink></li>
                            <li><NavLink exact to="/sugerencias">Buzón de sugerencias</NavLink></li>
                            <li><NavLink exact to="/biblioteca">Biblioteca</NavLink></li>
                            <li><NavLink exact to="/miperfil">Modificá tu perfil</NavLink></li>
                            <li><NavLink onClick={handleLogout} exact to="/login">Cerrar sesión</NavLink></li>
                        </ul>
                    </div>

                </div>

                <div className="Footer__content-bottom">
                    <p>Tel.: (03401) 480-920. E-mail: recursoshumanos@dpmsa.com.ar. Sitio web: dpm.com.ar. Whatsapp RRHH: 3401 51-0124.</p>
                    <p>Mitre 726. Carlos Pellegrini, Santa Fe, Argentina. Las imágenes son ilustrativas. No contractuales. Todos los derechos reservados a DPM S.A.</p>
                </div>

            </div>
            <img src="./assets/isotipo-footer.png" className="Footer__isotipo" />
        </footer>
    )
}

export default Footer
