import React, { useState } from 'react'
import SidebarAdmin from './SidebarAdmin'
import Trix from "trix";
import { v4 as uuidv4 } from 'uuid';
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import './NewPost.css'
import { storage } from '../config/firebase';
import { useStateValue } from '../StateProvider';
import axios from 'axios';

const NewPost = () => {
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
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleContentChange = (event) => {
        setContent(event.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        await axios.post('https://internal-app-dpm.herokuapp.com/post',
            {
                "title": `${title}`,
                "content": `${content}`,
                "image": `${imgUrl}`,
                "tags": tags
            },
            { headers })
            .then(resp => console.log(resp))
    }
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        let imageId = uuidv4();
        const storageRef = storage.ref().child('postImages').child(`${imageId}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImgUrl(url)
        setFilename(file.name)
        setLoadingImg(false)
    }
    const handleTags = (e) => {
        if (e.target.value === "") return
        const tagSelected = (element) => element === e.target.value;
        if (tags.some(tagSelected)) return
        setTags([...tags, e.target.value])
    }
    const handleDeleteTag = (e) => {
        let tagSelected = e.target.parentElement.innerText
        setTags(tags.filter(tag => tag !== tagSelected))
    }
    return (
        <>
            <SidebarAdmin />
            <div className="NewPost">
                <div className="NewPost__container">
                    <h1>Crear una nueva publicación</h1>
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
                                <button disabled={loadingImg} type="button" onClick={handlePictureClick}>
                                    {
                                        loadingImg
                                            ? <>
                                                Espere...
                                            </>
                                            : <>
                                                <i class="fas fa-plus"></i>
                                                Cargar imagen para publicacion
                                            </>
                                    }

                                </button>
                            </div>
                            <input value={title} onChange={handleTitleChange} placeholder="Insertar titulo de la publicación" />
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
                            tags.length !== 0 &&
                            <>
                                <label>Tags:</label>
                                <div className="NewPost__tags">
                                    {tags.map(tag => (
                                        <div>
                                            {tag}
                                            <i onClick={handleDeleteTag} class="fas fa-times"></i>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                        <div>
                            <select className="form-select" onChange={handleTags} name="tags">
                                <option value="">Elegir una categoria</option>
                                <option value="Novedades generales">Novedades generales</option>
                                <option value="Higiene y seguridad">Higiene y seguridad</option>
                                <option value="Incorporaciones">Incorporaciones</option>
                                <option value="Efeméride">Efemérides</option>
                                <option value="Cumpleaños">Cumpleaños</option>
                                <option value="Buzón de sugerencias">Buzón de sugerencias</option>
                                <option value="Desvinculaciones">Desvinculaciones</option>
                                <option value="Capacitaciones">Capacitaciones</option>
                                <option value="Felicitaciones">Felicitaciones</option>
                                <option value="Sistemas informáticos">Sistemas informáticos</option>
                                <option value="Aniversarios">Aniversarios</option>
                                <option value="Beneficios">Beneficios</option>
                                <option value="Nueva">Agregar una categoria nueva</option>
                            </select>
                            <button type="submit">
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewPost
