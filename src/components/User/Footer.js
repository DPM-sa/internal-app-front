import React from 'react'
import { Link } from 'react-router-dom'
import { useStateValue } from '../../StateProvider'
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
                            <li><Link exact to="/home">Inicio</Link></li>
                            <li><Link exact to="/directorio">Directorio</Link></li>
                            <li><Link exact to="/sugerencias">Buzón de sugerencias</Link></li>
                            <li><Link exact to="/biblioteca">Biblioteca</Link></li>
                            <li><Link exact to="/miperfil">Modificá tu perfil</Link></li>
                            <li><Link onClick={handleLogout} exact to="/login">Cerrar sesión</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="Footer__content-bottom">
                    <p>Tel.: (03401) 480-920. E-mail: recursoshumanos@dpmsa.com.ar. Sitio web: dpm.com.ar. Whatsapp RRHH: 3401 590 738.</p>
                    <p>Mitre 726. Carlos Pellegrini, Santa Fe, Argentina. Las imágenes son ilustrativas. No contractuales. Todos los derechos reservados a DPM S.A.</p>
                </div>

            </div>
            <img src="./assets/isotipo-footer.png" className="Footer__isotipo" />
        </footer>
    )
}

export default Footer
