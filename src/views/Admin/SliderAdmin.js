import React, { useState } from 'react'
import SidebarAdmin from '../../components/SidebarAdmin'
import './SliderAdmin.css'

const SliderAdmin = () => {

    const [form1, setForm1] = useState({
        title1: '',
        content1: '',
        url1: ''
    })
    const [form2, setForm2] = useState({
        title2: '',
        content2: '',
        url2: ''
    })
    const [form3, setForm3] = useState({
        title3: '',
        content3: '',
        url3: ''
    })
    const handleInputChange1 = (e) => {
        setForm1({
            ...form1,
            [e.target.name]: e.target.value
        })
    }
    const handleInputChange2 = (e) => {
        setForm2({
            ...form2,
            [e.target.name]: e.target.value
        })
    }
    const handleInputChange3 = (e) => {
        setForm3({
            ...form1,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit1 = (e) => {
        e.preventDefault()
    }
    const handleSubmit2 = (e) => {
        e.preventDefault()
    }
    const handleSubmit3 = (e) => {
        e.preventDefault()
    }
    return (
        <>
            <SidebarAdmin />
            <div className="PostsAdmin">
                <div className="PostsAdmin-container">
                    <h1>Modificar slider principal</h1>
                    <div className="SliderAdmin-container">
                        <div className="SliderAdmin">
                            <img />
                            <form onSubmit={handleSubmit1}>
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <img />
                            <form onSubmit={handleSubmit2}>
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
                                </button>
                            </form>
                        </div>
                        <div className="SliderAdmin">
                            <img />
                            <form onSubmit={handleSubmit3}>
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <input type="text" className="SliderAdmin__input" />
                                <button type="submit">
                                    Guardar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SliderAdmin
