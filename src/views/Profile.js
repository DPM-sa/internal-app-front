import axios from 'axios'
import React, { useState, useEffect } from 'react'
import NavbarProfile from '../components/NavbarProfile'
import { useStateValue } from '../StateProvider'
import { storage } from '../config/firebase'
import './Profile.css'
import Footer from '../components/Footer'
import moment from 'moment'
const Profile = () => {
    const [{ user, token }, dispatch] = useStateValue()

    let headers = {
        'Content-Type': 'application/json',
        "token": `${token}`
    }
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const [edit, setEdit] = useState(false)

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

    const [imageProfile, setImageProfile] = useState(user.image ? user.image : '')

    const [loading, setLoading] = useState(false)

    const [loadingImg, setLoadingImg] = useState(false)

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

    const handlePictureClick = () => {
        document.querySelector("#fileSelector").click()
    }

    const handleFileChange = async (e) => {
        setLoadingImg(true)
        const file = e.target.files[0]
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        const res = await storageRef.put(file)
        const url = await storageRef.getDownloadURL()
        await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
            {
                "image": `${url}`
            },
            { headers })
            .then(() => {
                setImageProfile(url)
                setLoadingImg(false)
            })
    }

    const formatDateProfile = (date) => {
        return date.substring(0, 10)
    }

    const handleDeleteImage = () => {
        setLoadingImg(true)
        const storageRef = storage.ref().child('profileImages').child(`${user.user}`)
        storageRef.delete().then(async () => {
            await axios.put(`https://internal-app-dpm.herokuapp.com/usuario/${user._id}`,
                {
                    "image": ""
                },
                { headers })
                .then(() => {
                    setImageProfile('')
                    setLoadingImg(false)
                })
        })
    }

    const handleEdit = () => {
        setEdit(!edit)
    }

    return (
        <>
            <NavbarProfile />
            <div className="Profile">
                <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                        {imageProfile ? <img src={imageProfile} className="profile-image-medium rounded-circle mb-2" width="150" /> : <i class="far fa-user no-image-profile-medium mb-2"></i>}
                        {edit && !loadingImg
                            &&
                            <>
                                <p className="editImage" onClick={handlePictureClick}>
                                    <i class="fas fa-plus"></i>
                                    Cambiar foto de perfil
                                </p>
                                <p className="editImage" onClick={handleDeleteImage}>
                                    <i class="fas fa-trash-alt"></i>
                                    Eliminar foto de perfil
                                </p>
                            </>
                        }
                        {
                            edit && loadingImg
                            &&
                            <p className="text-secondary">Cargando...</p>
                        }
                        <div className="mt-3">
                            <h4 className="Profile__name">¡Hola {user.nombre} {user.apellido}!</h4>
                            <p className="Profile__info">{user.position}</p>
                            <p className="Profile__info">{user.sector}</p>
                            <input
                                id="fileSelector"
                                type="file"
                                name="file"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {
                    edit
                        ?
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
                                    <input type="date" className="Profile__data-input" name="birth" value={formatDateProfile(birth)} onChange={handleInputChange} />
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

                        :
                        <div className="Profile__data">
                            <div className="Profile__data-row">
                                <div><h6>Usuario</h6></div>
                                <div><p>{user.user}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Nombre</h6></div>
                                <div><p>{user.nombre} {user.apellido}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div>
                                    <h6>Email</h6>
                                </div>
                                <div>
                                    <p>{user.correo && user.correo}</p>
                                </div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Telefono</h6></div>
                                <div><p>{user.phone && user.phone}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Fecha de nacimiento</h6></div>
                                <div><p>{user.birth && formatDateProfile(user.birth)}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Cargo</h6></div>
                                <div><p>{user.position && user.position}</p></div>
                            </div>
                            <div className="Profile__data-row">
                                <div><h6>Sector</h6></div>
                                <div><p>{user.sector && user.sector}</p></div>
                            </div>
                            <div className="Profile__data-row-button">
                                <button onClick={handleEdit} className="Profile__data-button">
                                    <i class="fas fa-pen"></i>
                                    Editar
                                </button>
                            </div>
                        </div>
                }
            </div>
            <Footer />
        </>
    )
}

export default Profile
