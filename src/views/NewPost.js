import React, { useState } from 'react'
import SidebarAdmin from './SidebarAdmin'
import Trix from "trix";
import { ReactTrixRTEInput, ReactTrixRTEToolbar } from "react-trix-rte";
import './NewPost.css'

const NewPost = () => {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(value)
    }

    function handleChange(event, newValue) {
        setValue(newValue);
    }
    return (
        <>
            <SidebarAdmin />
            <div className="Admin">
                <div className="editor">
                    <ReactTrixRTEToolbar toolbarId="react-trix-rte-editor" />
                    <form onSubmit={handleSubmit}>
                        <ReactTrixRTEInput
                            toolbarId="react-trix-rte-editor"
                            defaultValue=""
                            onChange={handleChange}
                            placeholder="Insertar aquí texto de la publicación"
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewPost
