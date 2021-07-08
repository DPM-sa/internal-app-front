import React from 'react'
import NavbarProfile from '../components/NavbarProfile'
import './Sugerencias.css'
import Footer from '../components/Footer'
const Sugerencias = () => {
    return (
        <>
            <NavbarProfile />
            <div className="Directorio__banner">
                <img className="Directorio__banner-img" src="./assets/banner-buzon.jpg" />
                <div className="Directorio__banner-content">
                    <h1>Buzon de sugerencias</h1>
                    <p>Encontra aqui a todos los colaboradores de DPM</p>
                    <button className="Directorio__banner-button">+ Ver más</button>
                </div>
            </div>
            <div className="Sugerencias">
                <h3>
                    Enviar una sugerencia
                </h3>
                <form>
                    <div className="form-group">
                        <input type="text" className="Sugerencias__input" placeholder="Cuál es tu sugerencia?" />
                    </div>
                    <div className="form-group">
                        <textarea className="Sugerencias__textarea" rows="3" placeholder="Desarrolla aqui tu sugerencia, cuanta más informacion brindes mejor"></textarea>
                    </div>
                    <button className="Sugerencias__button">Enviar</button>
                </form>
                <h3>Mis sugerencias enviadas</h3>
                <div className="Sugerencias__enviadas">
                    <div className="Sugerencia">
                        <h5 className="card-title">Special title treatment</h5>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                    <div className="Sugerencia">
                        <h5 className="card-title">Special title treatment</h5>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    )
}

export default Sugerencias
