import React from 'react'
import './Options.css'
const Options = () => {
    return (
        <div className="Options">
            <div className="Option">
                <i class="far fa-envelope"></i>Buzon de sugerencias
            </div>
            <div className="Option">
                <i class="far fa-file-alt"></i> Biblioteca de archivos
            </div>
            <div className="Option">
                <i class="far fa-user"></i> Modifica tu perfil
            </div>
            <div className="Option">
                <i class="far fa-address-book"></i>Directorio de usuarios
            </div>
        </div>
    )
}

export default Options
