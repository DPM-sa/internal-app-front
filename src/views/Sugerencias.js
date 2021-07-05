import React from 'react'
import NavbarProfile from '../components/NavbarProfile'
import './Sugerencias.css'
const Sugerencias = () => {
    return (
        <>
            <NavbarProfile />
            <div className="Sugerencias">
                <h1>Buzon de sugerencias</h1>
                <form className="card">
                    <div className="form-group">
                        <label>Titulo de sugerencia</label>
                        <input type="text" className="form-control" placeholder="Titulo de sugerencia" />
                    </div>
                    <div className="form-group">
                        <label>Contenido de sugerencia</label>
                        <textarea className="form-control" rows="3"></textarea>
                    </div>
                    <button className="btn btn-primary">Enviar Sugerencia</button>
                </form>
                <h3>Mis sugerencias enviadas</h3>
                <div className="Sugerencias__enviadas card">
                    <div className="Sugerencia card">
                        <div className="card-header">
                            <h5 className="card-title">Special title treatment</h5>
                            <p className="card-date">28 jun 2021</p>
                        </div>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                    <div className="Sugerencia card">
                        <div className="card-header">
                            <h5 className="card-title">Special title treatment</h5>
                            <p className="card-date">28 jun 2021</p>
                        </div>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                    <div className="Sugerencia card">
                        <div className="card-header">
                            <h5 className="card-title">Special title treatment</h5>
                            <p className="card-date">28 jun 2021</p>
                        </div>
                        <div className="card-body">
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Sugerencias
