import axios from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'
import './NewFile.css'
const NewFile = () => {
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
    const [loading, setLoading] = useState(false)


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
        if (title === "" || filename === "") return
        setLoading(true)
        const storageRef = storage.ref().child('BibliotecaFiles').child(`${title}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.post('https://internal-app-dpm.herokuapp.com/file',
            {
                "title": `${title}`,
                "url": `${url}`
            }, { headers })
            .then(() => {
                setLoading(false)
                Swal.fire(
                    'Éxito',
                    'El archivo se ha creado con éxito',
                    'success'
                )
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
                        <button disabled={loading} onClick={handlePictureClick} type="button">
                            <i class="fas fa-plus"></i>
                            Cargar el nuevo archivo
                        </button>
                        <input disabled={loading} name="title" value={title} onChange={handleInputChange} type="text" placeholder="Titulo del archivo" />
                    </div>
                    {filename && <span>{filename}</span>}
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
                                            <i class="far fa-save"></i>
                                            Guardar
                                        </>
                                }

                            </button>
                            <button disabled={loading} onClick={handleReturn} type="button">
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

export default NewFile
