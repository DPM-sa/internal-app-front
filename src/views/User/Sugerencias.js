import React, { useState, useEffect } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import Footer from '../../components/User/Footer'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'
import './Sugerencias.css'
import axios from 'axios'
import { useStateValue } from '../../StateProvider'
import { apiURL } from '../../config/api'
const Sugerencias = () => {

    const [{ token }] = useStateValue()

    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const [form, setForm] = useState({
        title: '',
        content: ''
    })
    const { title, content } = form
    const [sugerencias, setSugerencias] = useState([])
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || content === "") return
        await axios.post(`${apiURL}/sendmessage`,
            {
                "title": `${title}`,
                "content": `${content}`
            },
            { headers })
            .then(() => {
                setForm({
                    title: '',
                    content: ''
                })
                getSugerencias()
            })
    }
    const getSugerencias = async () => {
        await axios.get(`${apiURL}/usermessages`, { headers })
            .then(resp => setSugerencias(resp.data.messages))
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        getSugerencias()
    }, [])

    return (
        <>
            <NavbarProfile />
            <Banner 
                image={"./assets/banner-buzon.jpg"} 
                title={'Buzon de sugerencias'} 
                content={'Aquí podés enviarnos tus sugerencias y evaluarlas para que juntos podamos mejorar'} 
                linkto={'sugerencias'}
             />

            <div className="Sugerencias">
                <h3>
                    Completa el formulario con tu sugerencia
                </h3>
                <form onSubmit={handleSubmit}>
                    <div id="sugerencias" className="form-group">
                        <input name="title" value={title} onChange={handleInputChange} type="text" className="Sugerencias__input" placeholder="¿Cuál es tu sugerencia?" />
                    </div>
                    <div className="form-group">
                        <textarea name="content" value={content} onChange={handleInputChange} className="Sugerencias__textarea" rows="3" placeholder="Desarrolla aquí tu sugerencia, mientras más información brindes mejor…"></textarea>
                    </div>
                    <button type="submit" className="Sugerencias__button">
                        <i className="far fa-paper-plane"></i>
                        Enviar
                    </button>
                </form>
                <h3>Mis sugerencias enviadas</h3>
                <div className="Sugerencias__enviadas">
                    {
                        sugerencias.length === 0
                        && <p>No tienes sugerencias enviadas</p>
                    }
                    {
                        sugerencias.map(sugerencia => (
                            <div key={sugerencia._id} className="Sugerencia">
                                <h5>{sugerencia.title}</h5>
                                <p>{sugerencia.content}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <WhatsappBtn />
            <Footer />
        </>

    )
}

export default Sugerencias
