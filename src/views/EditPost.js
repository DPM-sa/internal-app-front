import React, { useState, useEffect } from 'react'
import SidebarAdmin from './SidebarAdmin'
import { v4 as uuidv4 } from 'uuid';
import "trix/dist/trix";
import { TrixEditor } from "react-trix";
import './EditPost.css'
import { storage } from '../config/firebase';
import { useStateValue } from '../StateProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';
import { useHistory, useParams } from 'react-router-dom'

const EditPost = () => {
    const history = useHistory()
    const { id } = useParams()
    const [{ token }] = useStateValue()
    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [filename, setFilename] = useState('')
    const [tags, setTags] = useState([])
    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleContentChange = (event) => {
        setContent(event)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || content === "" || imgUrl === "") return
        setLoading(true)
        await axios.post('https://internal-app-dpm.herokuapp.com/post',
            {
                "title": `${title}`,
                "content": `${content}`,
                "image": `${imgUrl}`,
                "tags": tags
            },
            { headers })
            .then(resp => {
                console.log(resp)
                Swal.fire(
                    'Exito',
                    'El post se ha subido con exito',
                    'success'
                )
                setLoading(false)
                setTitle('')
                setContent('')
                setImgUrl('')
                setFilename('')
                setTags([])
            })
    }
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        let imageId = uuidv4();
        const storageRef = storage.ref().child('postImages').child(`${file.name}-${imageId}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImgUrl(url)
        setFilename(file.name)
        setLoadingImg(false)
    }
    const handleTags = (value) => {
        const valuesToArray = value.map(item => item.value)
        setTags(valuesToArray)
    }

    const NoOptionsMessage = () => {
        return (
            <>
                <span>No hay opciones disponibles</span>
            </>
        );
    };
    const optionsTags = [
        { value: 'Novedades generales', label: 'Novedades generales' },
        { value: 'Higiene y seguridad', label: 'Higiene y seguridad' },
        { value: 'Incorporaciones', label: 'Incorporaciones' },
        { value: 'Efemérides', label: 'Efemérides' },
        { value: 'Cumpleaños', label: 'Cumpleaños' },
        { value: 'Buzón de sugerencias', label: 'Buzón de sugerencias' },
        { value: 'Desvinculaciones', label: 'Desvinculaciones' },
        { value: 'Capacitaciones', label: 'Capacitaciones' },
        { value: 'Felicitaciones', label: 'Felicitaciones' },
        { value: 'Sistemas informáticos', label: 'Sistemas informáticos' },
        { value: 'Aniversarios', label: 'Aniversarios' },
        { value: 'Beneficios', label: 'Beneficios' },
    ]

    const getPost = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
            .then(resp => {
                setTitle(resp.data.post.title)
                setContent(resp.data.post.content)
                setTags(resp.data.post.tags)
                setImgUrl(resp.data.post.image)
                setFilename(resp.data.post.image)
            })
    }

    useEffect(() => {
        getPost()
    }, [])

    const handleEditorReady = async () => {
        const trixEditor = document.querySelector('.trix-editor-class')
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
            .then(resp => {
                trixEditor.value = resp.data.post.content
            })
    }
    const handleWatchComments = () => {
        history.push(`/editpost/${id}/comments`)
    }
    return (
        <>
            <SidebarAdmin />
            <div className="NewPost">
                <div className="NewPost__container">
                    <h1>Editar una publicacion</h1>
                    <div className="NewPost__content">
                        <input
                            id="fileSelector"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <form onSubmit={handleSubmit}>
                            <div className="NewPost__actions">
                                {
                                    loadingImg
                                        ?
                                        <button disabled type="button">
                                            Espere...
                                        </button>
                                        :
                                        <button disabled={loadingImg || loading} type="button" onClick={handlePictureClick}>
                                            <i class="fas fa-plus"></i>
                                            Cambiar imagen de publicacion
                                        </button>
                                }
                                <input disabled={loading} value={title} onChange={handleTitleChange} placeholder="Insertar titulo de la publicación" />
                            </div>
                            {filename && <span>{filename}</span>}
                            <div className="editor">
                                <TrixEditor
                                    className="trix-editor-class"
                                    onChange={handleContentChange}
                                    value={content}
                                    onEditorReady={handleEditorReady}
                                />
                            </div>
                            <div className="EditPost__actions-bottom">
                                <CreatableSelect
                                    isMulti
                                    onChange={handleTags}
                                    options={optionsTags}
                                    placeholder="Elegir una categoria"
                                    formatCreateLabel={userInput => `Agregar: ${userInput}`}
                                    classNamePrefix="react-select"
                                    noOptionsMessage={NoOptionsMessage}
                                    isDisabled={loading}
                                    value={optionsTags.filter(val => tags.includes(val.value))}
                                />
                                {
                                    loading
                                        ?
                                        <button disabled type="submit">
                                            Espere..
                                        </button>
                                        :
                                        <button disabled={loading} type="submit">
                                            <i class="fas fa-plus"></i>
                                            Guardar
                                        </button>
                                }
                                <button disabled={loading} onClick={handleWatchComments} type="button">
                                    <i class="far fa-eye"></i>
                                    Ver comentarios
                                </button>
                                <button disabled={loading} type="button">
                                    <i class="fas fa-chevron-left"></i>
                                    Volver atrás
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditPost
