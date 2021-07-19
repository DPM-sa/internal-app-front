import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { storage } from '../../config/firebase'
import { useStateValue } from '../../StateProvider'

const EditUser = () => {
    const { id } = useParams()
    const history = useHistory()
    const [{ token }] = useStateValue()
    const [form, setForm] = useState({
        user: '',
        password: '',
        nombre: '',
        apellido: '',
        email: '',
        phone: '',
        birth: '',
        position: '',
        sector: ''
    })
    const [role, setRole] = useState('')
    const { user, password, nombre, apellido, email, phone, birth, position, sector } = form
    const [img, setImg] = useState('')
    const [loadingImg, setLoadingImg] = useState(false)
    const headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }

    const getUser = async () => {
        await axios.get(`https://internal-app-dpm.herokuapp.com/usuario/${id}`, { headers })
            .then(resp => {
                setForm({
                    user: resp.data.user.user,
                    nombre: resp.data.user.nombre,
                    apellido: resp.data.user.apellido,
                    email: resp.data.user.correo ? resp.data.user.correo : '',
                    phone: resp.data.user.phone ? resp.data.user.phone : '',
                    birth: resp.data.user.birth ? resp.data.user.birth : '',
                    position: resp.data.user.position,
                    sector: resp.data.user.sector
                })
                setRole(resp.data.user.role)
                setImg(resp.data.user.image ? resp.data.user.image : '')
            })
    }

    const formatDateProfile = (date) => {
        return date.substring(0, 10)
    }
    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        getUser()
    }, [])
    const handleRole = (e) => {
        setRole(e.target.value)
    }
    const handleReturn = () => {
        history.push('/directorioadmin')
    }
    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }
    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${file.name}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        setImg(url)
        setLoadingImg(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user === "" || nombre === "" || apellido === "" || position === "" || sector === "") return
        await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
            {
                "user": `${user}`,
                "nombre": `${nombre}`,
                "apellido": `${apellido}`,
                "correo": `${email}`,
                "phone": `${phone}`,
                "birth": `${birth}`,
                "position": `${position}`,
                "sector": `${sector}`,
                "image": `${img}`,
                "role": `${role}`
            },
            { headers })
            .then(resp => console.log(resp))
    }
    const handleDeleteImage = () => {
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${id}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    setImg('')
                })
        })
    }
    return (
        <div className="PostComments">
            <div className="PostComments__container">
                <h1>Editar usuario</h1>
                <div className="NewUser__content">
                    <form onSubmit={handleSubmit} className="NewUser__data">
                        <div className="NewUser__data-row">
                            <label>Nombre de usuario</label>
                            <input onChange={handleInputChange} type="text" name="user" value={user} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Contraseña</label>
                            <input onChange={handleInputChange} type="password" name="password" value={password} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Nombre</label>
                            <input onChange={handleInputChange} type="text" name="nombre" value={nombre} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Apellido</label>
                            <input onChange={handleInputChange} type="text" name="apellido" value={apellido} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Email (Opcional)</label>
                            <input onChange={handleInputChange} type="email" name="email" value={email} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Teléfono (Opcional)</label>
                            <input onChange={handleInputChange} type="tel" name="phone" value={phone} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Fecha de nacimiento</label>
                            <input onChange={handleInputChange} type="date" name="birth" value={birth && formatDateProfile(birth)} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Cargo</label>
                            <input onChange={handleInputChange} type="text" name="position" value={position} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Sector</label>
                            <input onChange={handleInputChange} type="text" name="sector" value={sector} />
                        </div>
                        <div className="NewUser__data-row">
                            <label>Rol</label>
                            <select onChange={handleRole} value={role}>
                                <option value="">-- Seleccione --</option>
                                <option value="USER_ROLE">Usuario</option>
                                <option value="ADMIN_ROLE">Administrador</option>
                            </select>
                        </div>
                        <div className="NewUser__data-buttons">
                            <button type="submit">
                                <i class="far fa-save"></i>
                                Guardar
                            </button>
                            <button onClick={handleReturn} type="button">
                                <i class="fas fa-chevron-left"></i>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    <div className="NewUser__pic">
                        <input
                            id="fileSelector"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        {
                            img
                                ?
                                <>
                                    <img src={img} className="Profile-pic" />
                                    <p className="editImage" onClick={handlePictureClick}>
                                        <i class="fas fa-plus"></i>
                                        Cambiar foto de perfil
                                    </p>
                                    <p className="editImage" onClick={handleDeleteImage}>
                                        <i class="fas fa-trash-alt"></i>
                                        Eliminar foto de perfil
                                    </p>
                                </>
                                : <button disabled={loadingImg} onClick={handlePictureClick} className="Upload-pic">
                                    {loadingImg
                                        ?
                                        <>
                                            Espere...
                                        </>
                                        :
                                        <>
                                            <i class="fas fa-plus"></i>
                                            <p>Cargar imagen de perfil</p>
                                        </>}
                                </button>
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser
