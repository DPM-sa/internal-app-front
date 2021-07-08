import React from 'react'
import './Footer.css'

const Footer = () => {
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
                            <li>Inicio</li>
                            <li>Directorio</li>
                            <li>Buzón de sugerencias</li>
                            <li>Biblioteca</li>
                            <li>Modificá tu perfil</li>
                            <li>Cerrar sesión</li>
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
