import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const EditFile = () => {
    const { id } = useParams()
    const [{ token, editOrNewFile }, dispatch] = useStateValue()
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
    const [fileTemp, setFileTemp] = useState('')
    const [fileId, setFileId] = useState('')

    const [loading, setLoading] = useState(false)
    const [titleError, setTitleError] = useState('')

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = (e) => {
        setFilename(e.target.files[0].name)
        setFileTemp(e.target.files[0].name)
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
        if (title === "") {
            if (title === "") {
                setTitleError('El titulo es requerido')
            } else {
                setTitleError('')
            }
            return
        }
        setLoading(true)
        if (fileTemp !== "") {
            const storageRef = storage.ref().child('BibliotecaFiles').child(`${fileId}`)
            const res = await storageRef.put(file)
            const url = await storageRef.getDownloadURL()
            setFilename(url)
            await axios.put(`https://internal-app-dpm.herokuapp.com/file/${id}`,
                {
                    "title": `${title}`,
                    "url": `${url}`
                }, { headers })
                .then(() => {
                    setLoading(false)
                    Swal.fire(
                        'Éxito',
                        'El archivo se ha editado con éxito',
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
        } else if (fileTemp === "") {
            await axios.put(`https://internal-app-dpm.herokuapp.com/file/${id}`,
                {
                    "title": `${title}`
                }, { headers })
                .then(() => {
                    setLoading(false)
                    Swal.fire(
                        'Éxito',
                        'El archivo se ha editado con éxito',
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
                setFileId(resp.data.fileId)
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

                        <div className="NewFile__content-top-actions">
                            <button disabled={loading} onClick={handlePictureClick} type="button">
                                <i className="fas fa-plus"></i>
                                Cargar el nuevo archivo
                            </button>
                            <input disabled={loading} name="title" value={title} onChange={handleInputChange} type="text" placeholder="Titulo del archivo" />
                        </div>

                        <div className="NewFile__errors">
                            <span></span>
                            {
                                (titleError && !title)
                                && <span>{titleError}</span>
                            }
                        </div>
                    </div>
                    <p>{filename}</p>
                    <div className="NewFile__content-bottom">
                        <p>Formatos aceptados</p>
                        <p>.doc / .xls / .xlsx / .pdf / .jpg / .jpeg / .png / .gif / .mp4</p>
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
        </div >
    )
}

export default EditFile
