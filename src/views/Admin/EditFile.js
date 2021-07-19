import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const EditFile = () => {
    const { id } = useParams()
    const [{ token }] = useStateValue()
    const history = useHistory()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [form, setForm] = useState({
        title: ''
    })
    const { title } = form
    const [file, setFile] = useState({})
    const [filename, setFilename] = useState('')
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = (e) => {
        setFilename(e.target.files[0].name)
        setFile(e.target.files[0])
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const storageRef = storage.ref().child('BibliotecaFiles').child(`${title}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setFilename(url)
        await axios.put(`https://internal-app-dpm.herokuapp.com/file/${id}`,
            {
                "title": `${title}`,
                "url": `${url}`
            }, { headers })
            .then(resp => {
                console.log(resp)
            })
    }
    const handleReturn = () => {
        history.push('/bibliotecaadmin')
    }
    const getFile = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/file/${id}`, { headers })
            .then(resp => {
                setForm({
                    title: resp.data.file.title
                })
                setFilename(resp.data.file.url)
            })
    }
    useEffect(() => {
        getFile()
    }, [])
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar un archivo de la biblioteca</h1>
                <input
                    id="fileSelector"
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <form onSubmit={handleSubmit} className="NewFile__content">
                    <div className="NewFile__content-top">
                        <button onClick={handlePictureClick} type="submit">
                            <i class="fas fa-plus"></i>
                            Cargar el nuevo archivo
                        </button>
                        <input name="title" value={title} onChange={handleInputChange} type="text" placeholder="Titulo del archivo" />
                    </div>
                    <p>{filename}</p>
                    <div className="NewFile__content-bottom">
                        <p>Formatos aceptados</p>
                        <p>.doc / .xls / .xlsx / .pdf / .jpg / .jpeg / .png / .gif / .mp4</p>
                        <div className="NewFile-content-bottom-actions">
                            <button type="submit">
                                <i class="far fa-save"></i>
                                Guardar
                            </button>
                            <button onClick={handleReturn} type="button">
                                <i class="fas fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditFile
