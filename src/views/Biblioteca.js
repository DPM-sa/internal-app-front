import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import './Biblioteca.css'
import Footer from '../components/Footer'
const Biblioteca = () => {
    const [{ token }] = useStateValue()
    const [files, setFiles] = useState([])
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    useEffect(() => {
        const getFiles = async () => {
            await axios.get(`https://internal-app-dpm.herokuapp.com/files`, { headers })
                .then(resp => {
                    setFiles(resp.data.filesDB)
                })
        }
        getFiles()
    }, [])
    return (
        <>
            <NavbarProfile />
            <div className="Directorio__banner">
                <img className="Directorio__banner-img" src="./assets/banner-biblioteca.jpg" />
                <div className="Directorio__banner-content">
                    <h1>Biblioteca</h1>
                    <p>Encontra aqui materiales a disposicion para todos los colaboradores de DPM</p>
                    <button className="Directorio__banner-button">+ Ver más</button>
                </div>
            </div>
            <div className="Biblioteca__search">
                <form>
                    <input name="search" type="text" className="Biblioteca__search-input" placeholder="Buscar un archivo por nombre" />
                    <i className="fas fa-search Biblioteca__search-icon"></i>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        Ordenar alfabeticamente
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href="#">Más recientes</a></li>
                        <li><a className="dropdown-item" href="#">Más antiguos</a></li>
                    </ul>
                </div>
            </div>
            <div className="Biblioteca__files-section">
                {
                    files.map(file => (
                        <div key={file._id} className="Biblioteca__file" >
                            <i class="far fa-file-alt Biblioteca__file-icon"></i>
                            <h5 className="card-title text-center">{file.title}</h5>
                            <a href="#" className="Biblioteca__file-download">Descargar<i class="fas fa-download"></i></a>
                        </div>
                    ))
                }
            </div>
            <Footer />
        </>
    )
}

export default Biblioteca
