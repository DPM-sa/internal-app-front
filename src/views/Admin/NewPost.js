import React, { useEffect, useState } from 'react'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import './NewPost.css'
import { storage } from '../../config/firebase';
import { useStateValue } from '../../StateProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const NewPost = () => {
    const [{ token }] = useStateValue()
    const history = useHistory()
    const headers = {
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
    const [fileId, setFileId] = useState('')
    const [imgError, setImgError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleContentChange = (event) => {
        setContent(event.target.value)
    }
    useEffect(() => {
        let id = uuidv4()
        setFileId(id)
    }, [])

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
        await axios.post('https://internal-app-dpm.herokuapp.com/post',
            {
                "title": `${title}`,
                "content": `${content}`,
                "image": `${imgUrl}`,
                "tags": tags,
                "fileId": `${fileId}`
            },
            { headers })
            .then((resp) => {
                console.log(resp.data)
                Swal.fire(
                    'Exito',
                    'El post se ha subido con exito',
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
            })
            .catch(() => {
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
    const getTags = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/tags', { headers })
            .then(resp => {
                let arrTags = resp.data.arrayWithoutRepeatedTags
                let arrTagsObj = arrTags.map(tag => ({ value: tag, label: tag }))
                let newArray = [...optionsTags, ...arrTagsObj]
                let arrWithoutRepeated = newArray.filter((item, index, self) =>
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
    const handleReturn = () => {
        history.push('/admin')
    }
    return (
        <>
            <SidebarAdmin />
            <div className="NewPost">
                <div className="NewPost__container">
                    <h1>Crear una nueva publicación</h1>
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
                                    <button disabled={loadingImg || loading} type="button" onClick={handlePictureClick}>
                                        {
                                            loadingImg
                                                ? <>
                                                    Espere...
                                                </>
                                                : <>
                                                    <i className="fas fa-plus"></i>
                                                    Cargar imagen para publicacion
                                                </>
                                        }

                                    </button>
                                    <input disabled={loading} value={title} onChange={handleTitleChange} placeholder="Insertar titulo de la publicación" />
                                </div>
                                <div className="NewPost__errors">
                                    {
                                        (imgError && !filename)
                                            ? <span className="submitError">{imgError}</span>
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
                                <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" />

                                <ReactTrixRTEInput
                                    toolbarId="react-trix-rte-editor"
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Insertar aquí texto de la publicación"
                                />
                            </div>
                            {
                                (contentError && !content)
                                &&
                                <span className="submitError">{contentError}</span>
                            }
                            <div className="NewPost__actions-bottom">
                                <CreatableSelect
                                    isMulti
                                    onChange={handleTags}
                                    options={optionsTags}
                                    placeholder="Elegir una categoria"
                                    formatCreateLabel={userInput => `Agregar: ${userInput}`}
                                    classNamePrefix="react-select"
                                    noOptionsMessage={NoOptionsMessage}
                                    isDisabled={loading}
                                />
                                <button disabled={loading || loadingImg} type="submit">
                                    {
                                        loading
                                            ?
                                            <>
                                                Espere...
                                            </>
                                            :
                                            <>
                                                <i className="fas fa-plus"></i>
                                                Publicar
                                            </>
                                    }

                                </button>
                                <button onClick={handleReturn} disabled={loading || loadingImg} type="button">
                                    <i className="fas fa-chevron-left"></i>
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

export default NewPost
