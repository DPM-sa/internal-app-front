import React from 'react'
import { Link } from 'react-router-dom'
import './Options.css'
const Options = () => {
    return (
        <div className="Options">
            <Link to="/sugerencias" className="Option">
                <i class="far fa-envelope"></i>Buzón de sugerencias
            </Link>
            <Link to="/biblioteca" className="Option">
                <i class="far fa-file-alt"></i> Biblioteca de archivos
            </Link>
            <Link to="/miperfil" className="Option">
                <i class="far fa-user"></i> Modificá tu perfil
            </Link>
            <Link to="/directorio" className="Option">
                <i class="far fa-address-book"></i>Directorio de usuarios
            </Link>
        </div>
    )
}

export default Options