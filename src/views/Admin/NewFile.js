import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import { v4 as uuidv4 } from 'uuid';
import './NewFile.css'

const NewFile = () => {
    const [{ token, editOrNewFile }, dispatch] = useStateValue()

    const { sector } = useParams()
    const ruta = "https://internal-app-dpm.herokuapp.com";

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
    const [loading, setLoading] = useState(false)
    const [titleError, setTitleError] = useState('')
    const [filenameError, setFilenameError] = useState('')

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || filename === "") {
            if (title === "") {
                setTitleError('El titulo es requerido')
            } else {
                setTitleError('')
            }
            if (filename === "") {
                setFilenameError('El archivo es requerido')
            } else {
                setFilenameError('')
            }
            return
        }
        setLoading(true)
        let fileId = uuidv4()
        const storageRef = storage.ref().child('BibliotecaFiles').child(`${fileId}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.post(`${ ruta }/file`,
            {
                "title": `${title}`,
                "url": `${url}`,
                "sector": `${sector}`,
                "fileId": `${fileId}`
            }, { headers })
            .then(() => {
                setLoading(false)
                Swal.fire(
                    'Éxito',
                    'El archivo se ha creado con éxito',
                    'success'
                ).then(resp => {
                    if (resp) {
                        dispatch({
                            type: 'SET_EDIT_NEW_FILE',
                            editOrNewFile: !editOrNewFile
                        })
                        history.push('/bibliotecaadmin')
                    }
                })
            }).catch(() => {
                Swal.fire(
                    'Error',
                    'Ha ocurrido un error, comuníquese con el administrador',
                    'error'
                ).then((resp) => {
                    if (resp) {
                        setLoading(false)
                    }

                })
            })
    }
    const handleReturn = () => {
        history.push('/bibliotecaadmin')
    }
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Cargar un nuevo archivo a la biblioteca</h1>
                <input
                    id="fileSelector"
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <form onSubmit={handleSubmit} className="NewFile__content">
                    <div className="NewFile__content-top">

                        <div className="NewFile__content-top-actions">
                            <button disabled={loading} onClick={handlePictureClick} type="button">
                                <i className="fas fa-plus"></i>
                                Cargar el nuevo archivo
                            </button>
                            <input disabled={loading} name="title" value={title} onChange={handleInputChange} type="text" placeholder="Titulo del archivo" />
                        </div>

                        <div className="NewFile__errors">
                            {
                                (filenameError && !filename)
                                    ? <span>{filenameError}</span>
                                    : <span></span>
                            }
                            {
                                (titleError && !title)
                                && <span>{titleError}</span>
                            }
                        </div>

                    </div>
                    {filename && <span>{filename}</span>}
                    <div className="NewFile__content-bottom">
                        <p>Formatos aceptados</p>
                        <p>.doc / .xls / .xlsx / .pdf / .jpg / .jpeg / .png / .gif / .mp4</p>
                        <p>Carpeta de destino: { sector }</p>
                        <div className="NewFile-content-bottom-actions">
                            <button disabled={loading} type="submit">
                                {
                                    loading
                                        ? <>
                                            Espere...
                                        </>
                                        :
                                        <>
                                            <i className="far fa-save"></i>
                                            Guardar
                                        </>
                                }

                            </button>
                            <button disabled={loading} onClick={handleReturn} type="button">
                                <i className="fas fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewFile
