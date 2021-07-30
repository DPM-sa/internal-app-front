import React, { useState, useEffect } from 'react'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import "trix/dist/trix";
import { TrixEditor } from "react-trix";
import './EditPost.css'
import { storage } from '../../config/firebase';
import { useStateValue } from '../../StateProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

const EditPost = () => {
    const history = useHistory()
    const { id } = useParams()
    const [{ token }] = useStateValue()
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [filename, setFilename] = useState('')
    const [tags, setTags] = useState([])
    const [fileId, setFileId] = useState('')
    const [loadingImg, setLoadingImg] = useState(false)
    const [loading, setLoading] = useState(false)

    const [imgError, setImgError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleContentChange = (event) => {
        setContent(event)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || content === "" || imgUrl === "") {
            if (imgUrl === "") {
                setImgError('La imagen es requerida')
            } else {
                setImgError('')
            }
            if (title === "") {
                setTitleError('El titulo es requerido')
            } else {
                setTitleError('')
            }
            if (content === "") {
                setContentError('La descripcion es requerida')
            } else {
                setContentError('')
            }
            return
        }
        setLoading(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/post/${id}`,
            {
                "title": `${title}`,
                "content": `${content}`,
                "image": `${imgUrl}`,
                "tags": tags
            },
            { headers })
            .then(() => {
                Swal.fire(
                    'Exito',
                    'El post se ha actualizado con éxito',
                    'success'
                ).then((resp) => {
                    if (resp) {
                        setLoading(false)
                        setTitle('')
                        setContent('')
                        setImgUrl('')
                        setFilename('')
                        setTags([])
                        setFileId('')
                        history.push('/admin')
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
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('postImages').child(`${fileId}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImgUrl(url)
        setFilename(file.name)
        setLoadingImg(false)
    }

    const NoOptionsMessage = () => {
        return (
            <>
                <span>No hay opciones disponibles</span>
            </>
        );
    };
    const handleTags = (value) => {
        const valuesToArray = value.map(item => item.value)
        setTags(valuesToArray)
    }

    const [optionsTags, setOptionsTags] = useState([
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
    ])

    const getPost = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/post/${id}`, { headers })
            .then(resp => {
                setTitle(resp.data.post.title)
                setContent(resp.data.post.content)
                setTags(resp.data.post.tags)
                setImgUrl(resp.data.post.image)
                setFilename(resp.data.post.image)
                setFileId(resp.data.post.fileId)
            })
    }

    const getTags = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/tags', { headers })
            .then(resp => {
                let arrTags = resp.data.arrayWithoutRepeatedTags
                let arrTagsObj = arrTags.map(tag => ({ value: tag, label: tag }))
                let newArray = [...optionsTags, ...arrTagsObj]
                let arrFlat = newArray.flat()
                let arrWithoutRepeated = arrFlat.filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.value === item.value && t.label === item.label
                    ))
                )
                setOptionsTags(arrWithoutRepeated)
            })
    }

    useEffect(() => {
        getTags()
    }, [])

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
    const handleReturn = () => {
        history.push('/admin')
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
                                <div>
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
                                <div className="NewPost__actions">
                                    {
                                        (imgError && !filename)
                                            ? <span>{imgError}</span>
                                            : <span></span>
                                    }
                                    {
                                        (titleError && !title)
                                        && <span className="submitError">{titleError}</span>
                                    }
                                </div>
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
                            {
                                (contentError && !content)
                                &&
                                <span className="submitError">{contentError}</span>
                            }
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
                                        <button disabled={loading} type="submit">
                                            Espere..
                                        </button>
                                        :
                                        <button disabled={loading || loadingImg} type="submit">
                                            <i class="fas fa-plus"></i>
                                            Guardar
                                        </button>
                                }
                                <button disabled={loading} onClick={handleWatchComments} type="button">
                                    <i class="far fa-eye"></i>
                                    Ver comentarios
                                </button>
                                <button onClick={handleReturn} disabled={loading} type="button">
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
