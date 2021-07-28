import axios from 'axios'
import React, { useState } from 'react'
import { useStateValue } from '../../StateProvider'

const EditProfileInfo = ({ imageProfile }) => {

    const [{ user, token }, dispatch] = useStateValue()

    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo ? user.correo : '',
        phone: user.phone ? user.phone : '',
        birth: user.birth ? user.birth : '',
        position: user.position,
        sector: user.sector
    })

    const { nombre, apellido, correo, phone, birth, position, sector } = form

    const formatDateProfileToInput = (date) => {
        return date.substring(0, 10)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
            {
                "nombre": `${nombre}`,
                "apellido": `${apellido}`,
                "correo": `${correo}`,
                "phone": `${phone}`,
                "birth": `${birth}`,
                "position": `${position}`,
                "sector": `${sector}`,
                "image": `${imageProfile}`
            },
            { headers })
            .then((resp) => {
                dispatch({
                    type: 'LOGIN',
                    user: resp.data.usuario,
                    token: token
                })
                setLoading(false)
            })
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleEdit = () => {
        dispatch({
            type: 'SET_EDIT_PROFILE',
            editProfile: false
        })
    }

    return (
        <form onSubmit={handleSubmit} >
            <div className="Profile__data-row">
                <div>
                    <h6>Usuario</h6>
                </div>
                <div>
                    <p>{user.user}</p>
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Nombre</h6>
                </div>
                <div>
                    <input type="text" className="Profile__data-input" name="nombre" value={nombre} onChange={handleInputChange} />
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Apellido</h6>
                </div>
                <div>
                    <input type="text" className="Profile__data-input" name="apellido" value={apellido} onChange={handleInputChange} />
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Email</h6>
                </div>
                <div>
                    <input type="text" className="Profile__data-input" name="correo" value={correo} onChange={handleInputChange} />
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Telefono</h6>
                </div>
                <div>
                    <input type="text" className="Profile__data-input" name="phone" value={phone} onChange={handleInputChange} />
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Fecha de nacimiento</h6>
                </div>
                <div>
                    <input type="date" className="Profile__data-input" name="birth" value={formatDateProfileToInput(birth)} onChange={handleInputChange} />
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Cargo</h6>
                </div>
                <div>
                    <p>{position}</p>
                </div>
            </div>
            <div className="Profile__data-row">
                <div>
                    <h6>Sector</h6>
                </div>
                <div>
                    <p>{sector}</p>
                </div>
            </div>
            <div className="Profile__data-row-button">
                <div>
                    <button onClick={handleEdit}>
                        <i class="fas fa-chevron-left"></i>
                        Volver
                    </button>
                </div>
                <div>
                    {
                        loading
                            ?
                            <button disabled type="submit">Espere...</button>
                            :
                            <button type="submit">
                                <i class="far fa-save"></i>
                                Guardar
                            </button>
                    }
                </div>
            </div>
        </form>
    )
}

export default EditProfileInfo
