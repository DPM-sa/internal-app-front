import React, { useState } from 'react'
import SidebarAdmin from './SidebarAdmin'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import './NewPost.css'

const NewPost = () => {
    const [form, setForm] = useState({
        title: '',
        content: ''
    })
    const { title, content } = form
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <SidebarAdmin />
            <div className="NewPost">
                <div className="NewPost__container">
                    <h1>Crear una nueva publicación</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="NewPost__actions">
                            <button>
                                <i class="fas fa-plus"></i>
                                Cargar imagen para publicacion
                            </button>
                            <input value={title} name="title" onChange={handleInputChange} placeholder="Insertar titulo de la publicación" />
                        </div>
                        <div className="editor">
                            <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" />

                            <ReactTrixRTEInput
                                toolbarId="react-trix-rte-editor"
                                name="content"
                                value={content}
                                onChange={handleInputChange}
                                placeholder="Insertar aquí texto de la publicación"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewPost
