import React, { useState, useEffect } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import Footer from '../components/Footer'
import WhatsappBtn from '../components/WhatsappBtn'
import Banner from '../components/Banner'
import './Sugerencias.css'
import axios from 'axios'
import { useStateValue } from '../StateProvider'
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
        await axios.post('https://internal-app-dpm.herokuapp.com/sendmessage',
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
        await axios.get('https://internal-app-dpm.herokuapp.com/usermessages', { headers })
            .then(resp => setSugerencias(resp.data.messages))
    }
    useEffect(() => {
        getSugerencias()
    }, [])
    return (
        <>
            <NavbarProfile />
            <Banner image={"./assets/banner-buzon.jpg"} title={'Buzon de sugerencias'} content={'Encontra aqui a todos los colaboradores de DPM'} linkto={'sugerencias'} />

            <div className="Sugerencias">
                <h3>
                    Enviar una sugerencia
                </h3>
                <form onSubmit={handleSubmit}>
                    <div id="sugerencias" className="form-group">
                        <input name="title" value={title} onChange={handleInputChange} type="text" className="Sugerencias__input" placeholder="Cuál es tu sugerencia?" />
                    </div>
                    <div className="form-group">
                        <textarea name="content" value={content} onChange={handleInputChange} className="Sugerencias__textarea" rows="3" placeholder="Desarrolla aqui tu sugerencia, cuanta más informacion brindes mejor"></textarea>
                    </div>
                    <button type="submit" className="Sugerencias__button">Enviar</button>
                </form>
                <h3>Mis sugerencias enviadas</h3>
                <div className="Sugerencias__enviadas">
                    {
                        sugerencias.length === 0
                        && <p>No tienes sugerencias enviadas</p>
                    }
                    {
                        sugerencias.map(sugerencia => (
                            <div className="Sugerencia">
                                <h5 className="card-title">{sugerencia.title}</h5>
                                <div className="card-body">
                                    <p className="card-text">{sugerencia.content}</p>
                                </div>
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
