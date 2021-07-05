import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import './Biblioteca.css'
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
            <h1 className="Biblioteca__title">Biblioteca de archivos</h1>
            <div className="Biblioteca__files-section">
                {
                    files.map(file => (
                        <div key={file._id} className="card Biblioteca__file" >
                            <img src="./assets/file-image.png" className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{file.title}</h5>
                                <p className="card-text">build on thehe bulk of the card's content.</p>
                                <a href="#" className="btn btn-primary">Descargar <i className="fas fa-file-download"></i></a>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Biblioteca
