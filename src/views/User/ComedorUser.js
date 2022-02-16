import React, { useState, useEffect } from 'react'
import NavbarProfile from '../../components/User/NavbarProfile'
import Footer from '../../components/User/Footer'
import WhatsappBtn from '../../components/User/WhatsappBtn'
import Banner from '../../components/User/Banner'
import './Sugerencias.css'
import './ComedorUser.css'
import axios from 'axios'
import { useStateValue } from '../../StateProvider'
import { CancelarBtn } from '../../components/Buttons/CancelarBtn'
import { GuardarBtn } from '../../components/Buttons/GuardarBtn'


const ComedorUser = () => {

    const [{ token }] = useStateValue()

    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const [form, setForm] = useState({})
    const { nombre } = form
    const [sugerencias, setSugerencias] = useState([])
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     if (title === "" || content === "") return
    //     await axios.post('https://internal-app-dpm.herokuapp.com/sendmessage',
    //         {
    //             "title": `${title}`,
    //             "content": `${content}`
    //         },
    //         { headers })
    //         .then(() => {
    //             setForm({
    //                 title: '',
    //                 content: ''
    //             })
    //             getSugerencias()
    //         })
    // }
    const getSugerencias = async () => {
        await axios.get('https://internal-app-dpm.herokuapp.com/usermessages', { headers })
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
            <Banner image={"./assets/header-comedor.jpg"} title={'Reservá tu vianda'} content={'Aquí podés reservar tu lugar para mañana en los comedores de la empresa'} link={false} />

            <div className="Sugerencias">
                <h3>
                    Completa el formulario y reservá tu vianda
                </h3>

                <div style={{ paddingBottom: 50, borderBottom: '2px solid #004580' }}>
                    <form className='comedor-user-form'>
                        <div>
                            <label>Comedor</label>
                            <select >
                                <option>Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label>Fecha</label>
                            <input type='date' />
                        </div>
                        <div>
                            <label>Turno</label>
                            <select >
                                <option>Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label>Vianda</label>
                            <select >
                                <option>Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label>Cantidad</label>
                            <input type='number' />
                        </div>
                        <div>
                            <label>Total</label>
                            <input type='number' disabled />
                        </div>
                        <div >
                            <GuardarBtn title='Confirmar' variation='blue' />
                            <CancelarBtn title='Cancelar' variation='dark'/>
                        </div>

                    </form>

                </div>


                <h3>Mis reservas</h3>
                <div className="Sugerencias__enviadas">
                    {/* {
                        reservas.length === 0
                        && <p>No tienes reservas</p>
                    }
                    {
                        reservas.map(sugerencia => (
                            <div key={sugerencia._id} className="Sugerencia">
                                <h5>{sugerencia.title}</h5>
                                <p>{sugerencia.content}</p>
                            </div>
                        ))
                    } */}
                </div>
            </div>

            <WhatsappBtn />
            <Footer />
        </>

    )
}

export default ComedorUser
