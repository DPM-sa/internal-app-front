import React, { useState, useEffect } from 'react'
import SidebarAdmin from '../../components/Admin/SidebarAdmin'
import "trix/dist/trix";
// import { TrixEditor } from "react-trix";
import './EditPost.css'
import { storage } from '../../config/firebase';
import { useStateValue } from '../../StateProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory, useParams } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

import { v4 as uuidv4 } from 'uuid';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import draftToHtmlPuri from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import { apiURL } from '../../config/api';

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
        const htmlPuri = draftToHtmlPuri(
            convertToRaw(content.getCurrentContent())
        );

        if (title === "" || content === "" || imgUrl === "" || htmlPuri === '') {
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
        await axios.put(`${apiURL}/post/${id}`,
            {
                "title": `${title}`,
                "content": `${htmlPuri}`,
                "image": `${imgUrl}`,
                "tags": tags
            },
            { headers })
            .then(() => {
                Swal.fire(
                    'Exito',
                    'El post se ha actualizado con ??xito',
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
                    'Ha ocurrido un error, comun??quese con el administrador',
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
        { value: 'Efem??rides', label: 'Efem??rides' },
        { value: 'Cumplea??os', label: 'Cumplea??os' },
        { value: 'Buz??n de sugerencias', label: 'Buz??n de sugerencias' },
        { value: 'Desvinculaciones', label: 'Desvinculaciones' },
        { value: 'Capacitaciones', label: 'Capacitaciones' },
        { value: 'Felicitaciones', label: 'Felicitaciones' },
        { value: 'Sistemas inform??ticos', label: 'Sistemas inform??ticos' },
        { value: 'Aniversarios', label: 'Aniversarios' },
        { value: 'Beneficios', label: 'Beneficios' },
    ])

    const getPost = async () => {
        await axios.get(`${apiURL}/post/${id}`, { headers })
            .then(resp => {
                const contentBlock = htmlToDraft(resp.data.post.content);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    const editorState = EditorState.createWithContent(contentState);
                    setContent(editorState)
                  }
                setTitle(resp.data.post.title)
                setTags(resp.data.post.tags)
                setImgUrl(resp.data.post.image)
                setFilename(resp.data.post.image)
                setFileId(resp.data.post.fileId)
            })
    }

    const getTags = async () => {
        await axios.get(`${apiURL}/tags`, { headers })
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
        await axios.get(`${apiURL}/post/${id}`, { headers })
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

    const uploadCallback = (file, callback) => {
        return new Promise((resolve, reject) => {
            const reader = new window.FileReader();
            let _fileid = uuidv4()
            reader.onloadend = async () => {
                const form_data = new FormData();
                form_data.append("file", file);
                const storageRef = storage.ref().child('postImages').child(`${_fileid}`)
                const res = await storageRef.put(file)
                const url = await storageRef.getDownloadURL()
                resolve({ data: { link: url } });
            };
            reader.readAsDataURL(file);
        });
    };

    const config = {
        image: {
            uploadCallback: uploadCallback,
            previewImage: true,
            alt: { present: true, mandatory: false },
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            defaultSize: {
                height: 'auto',
                width: '400px',
            },
        }
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
                                                <i className="fas fa-plus"></i>
                                                Cambiar imagen de publicacion
                                            </button>
                                    }
                                    <input disabled={loading} value={title} onChange={handleTitleChange} placeholder="Insertar titulo de la publicaci??n" />
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
                                {/* <TrixEditor
                                    className="trix-editor-class"
                                    onChange={handleContentChange}
                                    value={content}
                                    onEditorReady={handleEditorReady}
                                /> */}
                                <Editor
                                    toolbar={config}
                                    editorState={content}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={handleContentChange}
                                    placeholder="Ingresar texto..."
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
                                            <i className="fas fa-plus"></i>
                                            Guardar
                                        </button>
                                }
                                <button disabled={loading} onClick={handleWatchComments} type="button">
                                    <i className="far fa-eye"></i>
                                    Ver comentarios
                                </button>
                                <button onClick={handleReturn} disabled={loading} type="button">
                                    <i className="fas fa-chevron-left"></i>
                                    Volver atr??s
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
